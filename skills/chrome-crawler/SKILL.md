---
name: chrome-crawler
description: 使用 Chrome DevTools Protocol 访问网页并提取数据。当用户请求爬取网页、获取页面内容、访问网站数据时使用此 skill。
metadata:
  author: NPC-347
  version: "1.0"
---

# Chrome 网页数据采集器

通过 Chrome DevTools Protocol (CDP) 启动或连接 Chrome 浏览器，访问指定网页并提取数据。

## 使用场景

当用户请求以下内容时激活此 skill：
- "爬取这个网站的数据"、"获取页面内容"
- "访问这个 URL 并提取信息"
- "用 Chrome 打开网页获取数据"
- "从网页上提取 X"

## 技术实现

使用 `chrome-remote-interface` 库与 Chrome DevTools Protocol 通信。

### Chrome 启动参数

启动 Chrome 时需要添加远程调试端口：
```bash
chrome.exe --remote-debugging-port=9222 --user-data-dir="%TEMP%\chrome-profile"
```

### CDP 主要 Domain

| Domain | 功能 |
|--------|------|
| Page | 页面导航、生命周期控制 |
| Runtime | JavaScript 执行、表达式求值 |
| DOM | DOM 操作和查询 |

## 参数配置

### 必要参数

| 参数 | 说明 | 示例 |
|------|------|------|
| `url` | 目标网页 URL | `https://example.com` |

### 可选参数

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `waitStrategy` | 页面加载等待策略 | `load` |
| `timeout` | 页面加载超时（毫秒） | `30000` |
| `outputFormat` | 输出格式 | `json` |
| `headless` | 是否无头模式 | `true` |

### 等待策略

| 策略 | 说明 |
|------|------|
| `load` | 等待 `load` 事件触发 |
| `DOMContentLoaded` | 等待 DOM 构建完成 |
| `networkIdle` | 等待网络空闲 |
| `custom` | 自定义等待条件 |

## 数据提取方式

### 1. CSS 选择器提取

```javascript
document.querySelector('.title').textContent
document.querySelectorAll('.item').map(el => el.textContent)
```

### 2. XPath 提取

```javascript
document.evaluate('//h1[@class="title"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).textContent
```

### 3. 自定义脚本提取

```javascript
// 提取页面标题、描述和主要链接
{
  title: document.title,
  description: document.querySelector('meta[name="description"]')?.content,
  links: Array.from(document.querySelectorAll('a')).map(a => ({ href: a.href, text: a.textContent.trim() }))
}
```

## 执行流程

### 第一步：启动/连接 Chrome

```bash
# 启动 Chrome（如果未运行）
chrome.exe --remote-debugging-port=9222
```

连接 CDP 客户端：
```javascript
const CDP = require('chrome-remote-interface');

const client = await CDP({ port: 9222 });
const { Page, Runtime } = client;
```

### 第二步：导航到目标 URL

```javascript
await Page.enable();
await Page.navigate({ url: targetUrl });

// 等待页面加载
await Page.loadEventFired();
```

### 第三步：执行数据提取脚本

```javascript
await Runtime.enable();
const result = await Runtime.evaluate({
  expression: extractionScript,
  returnByValue: true
});
```

### 第四步：格式化输出

根据 `outputFormat` 参数返回格式化结果：
- `json`: 直接返回 JavaScript 对象
- `markdown`: 转换为 Markdown 格式
- `text`: 纯文本格式

### 第五步：清理资源

```javascript
await client.close();
```

## 示例对话

**用户**: 爬取 https://example.com 的页面标题和所有链接

**助手**: 正在启动 Chrome 并访问页面...

提取结果：
```json
{
  "title": "Example Domain",
  "links": [
    { "href": "https://www.iana.org/domains/example", "text": "More information..." }
  ]
}
```

---

## 错误处理

| 错误 | 处理方式 |
|------|----------|
| Chrome 未启动 | 提示用户启动 Chrome 或自动启动 |
| 页面加载超时 | 报告超时，建议增加 timeout 或检查网络 |
| 提取脚本错误 | 捕获异常并返回错误信息 |
| CORS 限制 | 使用 CDP Runtime 绕过 |

## 注意事项

- Chrome 默认端口为 9222，可通过配置修改
- 每次执行后关闭浏览器连接，释放资源
- 复杂页面可能需要调整等待策略
- 涉及登录的页面需要额外处理（可选功能）