/**
 * Chrome Browser Manager
 * 负责启动/连接 Chrome 浏览器
 */

import CDP from 'chrome-remote-interface';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  path.join(process.env.LOCALAPPDATA, 'Google\\Chrome\\Application\\chrome.exe')
];

export class BrowserManager {
  constructor(options = {}) {
    this.port = options.port || 9222;
    this.client = null;
    this.chromeProcess = null;
    this.headless = options.headless !== false;
  }

  /**
   * 查找 Chrome 可执行文件路径
   */
  findChromePath() {
    for (const chromePath of CHROME_PATHS) {
      try {
        if (fs.existsSync(chromePath)) {
          return chromePath;
        }
      } catch {
        continue;
      }
    }
    return null;
  }

  /**
   * 启动 Chrome 浏览器
   */
  async startChrome() {
    const chromePath = this.findChromePath();
    if (!chromePath) {
      throw new Error('未找到 Chrome 浏览器，请手动启动 Chrome 或安装 Chrome');
    }

    const tempDir = process.env.TEMP || process.env.TMP || '.';
    const profileDir = path.join(tempDir, `chrome-profile-${Date.now()}`);

    const args = [
      `--remote-debugging-port=${this.port}`,
      `--user-data-dir=${profileDir}`,
      '--no-first-run',
      '--no-default-browser-check'
    ];

    if (this.headless) {
      args.push('--headless');
    }

    this.chromeProcess = spawn(chromePath, args, {
      detached: true,
      stdio: 'ignore'
    });

    this.chromeProcess.unref();

    // 等待 Chrome 启动
    await this.waitForReady(5000);
  }

  /**
   * 等待 Chrome 准备就绪
   */
  async waitForReady(timeout = 5000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      try {
        await CDP.Version({ port: this.port });
        return true;
      } catch {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    throw new Error('Chrome 启动超时');
  }

  /**
   * 连接到 Chrome
   */
  async connect() {
    try {
      await CDP.Version({ port: this.port });
    } catch {
      // Chrome 未运行，尝试启动
      await this.startChrome();
    }

    this.client = await CDP({ port: this.port });
    return this.client;
  }

  /**
   * 关闭连接
   */
  async close() {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }

    if (this.chromeProcess) {
      try {
        this.chromeProcess.kill();
      } catch {
        // 进程可能已结束
      }
      this.chromeProcess = null;
    }
  }
}