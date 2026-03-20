#!/usr/bin/env node
/**
 * Chrome Crawler - Main Entry Point
 * 使用 Chrome DevTools Protocol 爬取网页数据
 */

import { BrowserManager } from './browser.js';
import { PageManager } from './page.js';
import { Extractor } from './extractor.js';

export class ChromeCrawler {
  constructor(options = {}) {
    this.browser = new BrowserManager({
      port: options.port || 9222,
      headless: options.headless !== false
    });
    this.options = options;
  }

  /**
   * 爬取单个页面
   */
  async crawl(url, extractionOptions = {}) {
    const {
      waitStrategy = 'load',
      timeout = 30000,
      outputFormat = 'json'
    } = extractionOptions;

    let client;
    try {
      // 连接 Chrome
      client = await this.browser.connect();

      // 创建页面管理器
      const page = new PageManager(client, { waitStrategy, timeout });
      await page.init();

      // 导航到目标页面
      console.log(`正在访问: ${url}`);

      try {
        await page.navigate(url);
        console.log('页面加载完成');
      } catch (navError) {
        console.error('导航失败:', navError.message);
        // 继续尝试获取数据
      }

      // 执行数据提取
      const script = this.buildExtractionScript(extractionOptions);
      console.log('执行提取脚本...');
      const data = await page.executeScript(script);
      console.log('数据提取成功');

      // 格式化输出
      return this.formatOutput(data, outputFormat);
    } catch (error) {
      console.error('爬取失败:', error.message);
      console.error('错误堆栈:', error.stack);
      throw error;
    } finally {
      if (client) {
        await client.close();
      }
    }
  }

  /**
   * 批量爬取多个页面
   */
  async crawlMultiple(urls, extractionOptions = {}) {
    const results = [];

    for (const url of urls) {
      try {
        const data = await this.crawl(url, extractionOptions);
        results.push({ url, data, success: true });
      } catch (error) {
        results.push({ url, error: error.message, success: false });
      }
    }

    return results;
  }

  /**
   * 构建提取脚本
   */
  buildExtractionScript(options) {
    const { type, selector, script } = options;

    if (script) {
      // 自定义脚本
      return Extractor.custom(script);
    }

    switch (type) {
      case 'css':
        return Extractor.css(selector, options);
      case 'xpath':
        return Extractor.xpath(selector);
      case 'pageInfo':
        return Extractor.pageInfo();
      case 'links':
        return Extractor.links(options);
      case 'headings':
        return Extractor.headings(options.level);
      case 'table':
        return Extractor.table(selector);
      case 'images':
        return Extractor.images();
      case 'json':
        return Extractor.json(selector);
      case 'form':
        return Extractor.form(selector);
      default:
        // 默认提取页面信息
        return Extractor.pageInfo();
    }
  }

  /**
   * 格式化输出
   */
  formatOutput(data, format) {
    switch (format) {
      case 'json':
        return JSON.stringify(data, null, 2);
      case 'markdown':
        return this.toMarkdown(data);
      case 'text':
        return this.toText(data);
      default:
        return data;
    }
  }

  /**
   * 转换为 Markdown 格式
   */
  toMarkdown(data) {
    if (typeof data !== 'object') {
      return String(data);
    }

    if (Array.isArray(data)) {
      return data.map(item => `- ${JSON.stringify(item)}`).join('\n');
    }

    let md = '';
    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value)) {
        md += `### ${key}\n\n${value.map(v => `- ${v}`).join('\n')}\n\n`;
      } else if (typeof value === 'object') {
        md += `### ${key}\n\n\`\`\`json\n${JSON.stringify(value, null, 2)}\n\`\`\`\n\n`;
      } else {
        md += `**${key}**: ${value}\n\n`;
      }
    }
    return md;
  }

  /**
   * 转换为纯文本格式
   */
  toText(data) {
    return JSON.stringify(data, null, 2);
  }

  /**
   * 关闭浏览器
   */
  async close() {
    await this.browser.close();
  }
}

// CLI 接口
const args = process.argv.slice(2);
if (args.length > 0) {
  const url = args[0];
  const crawler = new ChromeCrawler();

  crawler.crawl(url, {
    type: 'pageInfo'
  })
    .then(result => {
      console.log('\n爬取结果:');
      console.log(result);
      crawler.close();
    })
    .catch(err => {
      console.error('错误:', err.message);
      crawler.close();
      process.exit(1);
    });
}