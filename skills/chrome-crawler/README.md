# Chrome Crawler Skill

使用 Chrome DevTools Protocol (CDP) 访问网页并提取数据的 Claude Skill。

## 功能特性

- 🌐 通过 CDP 连接 Chrome 浏览器
- 📄 页面导航和加载控制
- 🎯 多种数据提取方式
- 🔧 支持自定义提取脚本
- 📊 多种输出格式 (JSON/Markdown/Text)

## 安装依赖

```bash
cd skills/chrome-crawler
npm install
```

## 使用方法

### 基本用法

```bash
# 启动 Chrome (带远程调试端口)
chrome.exe --remote-debugging-port=9222

# 运行爬虫
node src/index.js https://example.com
```

### 数据提取类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `pageInfo` | 页面基本信息 (title, url, description) | 默认 |
| `css` | CSS 选择器提取 | 提取单个/多个元素 |
| `xpath` | XPath 表达式提取 | 复杂结构定位 |
| `links` | 页面所有链接 | 可按域名过滤 |
| `headings` | 页面标题 (h1-h6) | 可指定级别 |
| `table` | 表格数据 | 提取表头和内容 |
| `images` | 图片信息 | src, alt, 尺寸 |
| `json` | JSON 数据 | script 标签内容 |
| `form` | 表单数据 | 字段和属性 |

### 提取示例

```javascript
import { ChromeCrawler } from './src/index.js';

const crawler = new ChromeCrawler();

// 提取页面信息
await crawler.crawl('https://example.com', { type: 'pageInfo' });

// CSS 选择器提取多个元素
await crawler.crawl('https://example.com', {
  type: 'css',
  selector: '.article-title',
  multiple: true
});

// 提取所有链接
await crawler.crawl('https://example.com', {
  type: 'links',
  domainOnly: true
});

// 自定义脚本
await crawler.crawl('https://example.com', {
  script: `
    {
      title: document.title,
      articles: Array.from(document.querySelectorAll('.article'))
        .map(a => ({
          title: a.querySelector('.title').textContent,
          link: a.querySelector('a').href
        }))
    }
  `
});

await crawler.close();
```

## API 参考

### ChromeCrawler

#### 构造函数
```javascript
new ChromeCrawler(options)
```

**选项:**
- `port` - Chrome 调试端口 (默认: 9222)
- `headless` - 无头模式 (默认: true)

#### crawl(url, options)

爬取单个页面。

**参数:**
- `url` - 目标 URL
- `options.waitStrategy` - 等待策略: `load` | `DOMContentLoaded` | `networkIdle`
- `options.timeout` - 超时时间 (毫秒)
- `options.outputFormat` - 输出格式: `json` | `markdown` | `text`
- `options.type` - 提取类型
- `options.selector` - CSS/XPath 选择器
- `options.script` - 自定义提取脚本

#### crawlMultiple(urls, options)

批量爬取多个页面。

#### close()

关闭浏览器连接。

## 技术说明

### Chrome 启动参数

```bash
--remote-debugging-port=9222      # 启用远程调试
--user-data-dir=<path>            # 用户数据目录
--no-first-run                     # 跳过首次运行
--headless                         # 无头模式
```

### CDP Domain

| Domain | 用途 |
|--------|------|
| Page | 页面导航、生命周期 |
| Runtime | JavaScript 执行 |
| DOM | DOM 操作 |
| Network | 网络监控 |

## 注意事项

1. 确保安装了 Chrome 浏览器
2. Chrome 需要以 `--remote-debugging-port` 参数启动
3. 复杂页面可能需要调整 `waitStrategy`
4. 涉及登录的页面需要额外处理
5. 批量爬取注意请求频率限制

## License

MIT