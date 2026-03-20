/**
 * Page Manager
 * 负责页面导航和操作
 */

export class PageManager {
  constructor(client, options = {}) {
    this.Page = client.Page;
    this.Runtime = client.Runtime;
    this.DOM = client.DOM;
    this.waitStrategy = options.waitStrategy || 'load';
    this.timeout = options.timeout || 30000;
  }

  /**
   * 初始化 Domain
   */
  async init() {
    await this.Page.enable();
    await this.Runtime.enable();
  }

  /**
   * 导航到指定 URL
   */
  async navigate(url) {
    await this.Page.navigate({ url });
    await this.waitForLoad();
  }

  /**
   * 等待页面加载完成
   */
  async waitForLoad() {
    switch (this.waitStrategy) {
      case 'load':
        await this.Page.loadEventFired();
        break;
      case 'DOMContentLoaded':
        await this.Page.domContentEventFired();
        break;
      case 'networkIdle':
        await this.waitForNetworkIdle();
        break;
      default:
        await this.Page.loadEventFired();
    }
  }

  /**
   * 等待网络空闲
   */
  async waitForNetworkIdle() {
    let inFlightRequests = 0;
    const checkInterval = 100;
    const maxWait = this.timeout;

    await this.Page.enable();
    await this.Network?.enable?.() || Promise.resolve();

    const requestWillBeSent = () => inFlightRequests++;
    const loadingFinished = () => inFlightRequests--;
    const loadingFailed = () => inFlightRequests--;

    this.Page.on('requestWillBeSent', requestWillBeSent);
    this.Page.on('loadingFinished', loadingFinished);
    this.Page.on('loadingFailed', loadingFailed);

    const startTime = Date.now();

    while (Date.now() - startTime < maxWait) {
      if (inFlightRequests === 0) {
        await new Promise(resolve => setTimeout(resolve, 500)); // 额外等待确保稳定
        break;
      }
      await new Promise(resolve => setTimeout(resolve, checkInterval));
    }

    this.Page.off('requestWillBeSent', requestWillBeSent);
    this.Page.off('loadingFinished', loadingFinished);
    this.Page.off('loadingFailed', loadingFailed);
  }

  /**
   * 执行 JavaScript 代码
   */
  async executeScript(script, options = {}) {
    const result = await this.Runtime.evaluate({
      expression: script,
      returnByValue: true,
      awaitPromise: options.awaitPromise !== false,
      timeout: options.timeout || this.timeout
    });

    if (result.exceptionDetails) {
      throw new Error(`脚本执行失败: ${result.exceptionDetails.text || JSON.stringify(result.exceptionDetails)}`);
    }

    return result.result.value;
  }

  /**
   * 等待元素出现
   */
  async waitForElement(selector, timeout = 10000) {
    const script = `
      (function waitForElement(selector, timeout) {
        return new Promise((resolve, reject) => {
          const element = document.querySelector(selector);
          if (element) return resolve(true);

          const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
              observer.disconnect();
              resolve(true);
            }
          });

          observer.observe(document.body, {
            childList: true,
            subtree: true
          });

          setTimeout(() => {
            observer.disconnect();
            reject(new Error('元素超时未出现'));
          }, timeout);
        });
      })
    `;

    return this.executeScript(`${script}('${selector}', ${timeout})`);
  }

  /**
   * 点击元素
   */
  async clickElement(selector) {
    const script = `
      (function clickElement(selector) {
        const element = document.querySelector(selector);
        if (!element) throw new Error('元素未找到: ' + selector);
        element.click();
        return true;
      })
    `;
    return this.executeScript(`${script}('${selector}')`);
  }

  /**
   * 截图
   */
  async captureScreenshot(format = 'png') {
    const result = await this.Page.captureScreenshot({ format });
    return Buffer.from(result.data, 'base64');
  }
}