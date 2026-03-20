# 浏览器 API

Chrome Browser Skill 基于 chrome-devtools-mcp 服务，本文档说明 Skill 指令与 MCP 工具的对应关系。

> 安装配置请参考 [安装指南](./installation.md)

## MCP 工具命名

chrome-devtools-mcp 提供的工具在 Claude Code 中带有前缀 `mcp__chrome-devtools-mcp_`：

| 完整工具名 | 简称 | 功能说明 |
|-----------|------|---------|
| `mcp__chrome-devtools-mcp_list_pages` | `list_pages` | 列出所有打开的页面/标签 |
| `mcp__chrome-devtools-mcp_new_page` | `new_page` | 创建新标签页 |
| `mcp__chrome-devtools-mcp_close_page` | `close_page` | 关闭标签页 |
| `mcp__chrome-devtools-mcp_navigate_page` | `navigate_page` | 导航到指定 URL |
| `mcp__chrome-devtools-mcp_get_page_content` | `get_page_content` | 获取页面 HTML 内容 |
| `mcp__chrome-devtools-mcp_evaluate_javascript` | `evaluate_javascript` | 执行 JavaScript 代码 |
| `mcp__chrome-devtools-mcp_screenshot` | `screenshot` | 截取页面截图 |

> 注意：实际工具名可能因 MCP 版本略有差异，请使用 `/mcp` 命令查看已加载的工具列表。

---

## 指令与工具映射

### 导航操作

| Skill 指令 | MCP 工具 | 参数 |
|-----------|---------|------|
| `navigate` | `navigate_page` | `{ url, pageId? }` |
| `new_page` | `new_page` | `{ url? }` |
| `close_page` | `close_page` | `{ pageId? }` |
| `list_pages` | `list_pages` | - |

### 内容获取

| Skill 指令 | MCP 工具 | 参数 |
|-----------|---------|------|
| `get_content` | `get_page_content` | `{ pageId?, selector? }` |
| `evaluate` | `evaluate_javascript` | `{ script, pageId? }` |
| `screenshot` | `screenshot` | `{ pageId?, selector?, fullPage? }` |

### 交互操作

交互操作通过 `evaluate_javascript` 执行相应的 JavaScript 代码实现。

> **注意**: 使用 JavaScript 模拟交互可能在某些框架下失效（如 React 合成事件），建议优先使用 MCP 提供的原生 CDP 交互方法（如果可用）。

#### click - 点击元素
```javascript
// 点击元素
document.querySelector('SELECTOR').click();

// 或触发更完整的点击事件
const el = document.querySelector('SELECTOR');
el.dispatchEvent(new MouseEvent('click', {
  bubbles: true,
  cancelable: true,
  view: window
}));
```

#### type - 输入文本
```javascript
const input = document.querySelector('SELECTOR');
input.value = 'TEXT';
input.dispatchEvent(new Event('input', { bubbles: true }));
input.dispatchEvent(new Event('change', { bubbles: true }));
```

#### press - 按键
```javascript
const key = 'Enter'; // 或其他按键
document.querySelector('SELECTOR')?.dispatchEvent(
  new KeyboardEvent('keydown', { key, bubbles: true })
);
document.querySelector('SELECTOR')?.dispatchEvent(
  new KeyboardEvent('keyup', { key, bubbles: true })
);
```

#### scroll - 滚动
```javascript
// 滚动到底部
window.scrollTo(0, document.body.scrollHeight);

// 滚动一屏
window.scrollBy(0, window.innerHeight);

// 滚动到元素
document.querySelector('SELECTOR').scrollIntoView();
```

---

## 常用脚本模板

### 获取页面信息
```javascript
({
  title: document.title,
  url: window.location.href,
  description: document.querySelector('meta[name="description"]')?.content,
  keywords: document.querySelector('meta[name="keywords"]')?.content
})
```

### 获取所有链接
```javascript
Array.from(document.querySelectorAll('a[href]'))
  .map(a => ({
    text: a.textContent.trim().slice(0, 50),
    href: a.href
  }))
  .filter(l => l.text && l.href)
```

### 获取表单数据
```javascript
Array.from(document.querySelectorAll('form'))
  .map(form => ({
    action: form.action,
    method: form.method,
    fields: Array.from(form.querySelectorAll('input, select, textarea'))
      .map(f => ({
        type: f.type,
        name: f.name,
        value: f.value,
        placeholder: f.placeholder
      }))
      .filter(f => f.name)
  }))
```

### 检查元素可见性
```javascript
const el = document.querySelector('SELECTOR');
el ? {
  exists: true,
  visible: el.offsetParent !== null,
  text: el.textContent?.trim()
} : { exists: false }
```

### 等待元素出现
```javascript
new Promise((resolve) => {
  const check = () => {
    const el = document.querySelector('SELECTOR');
    if (el) resolve(true);
    else requestAnimationFrame(check);
  };
  check();
})
```

---

## 错误处理

### 常见错误

| 错误信息 | 原因 | 解决方案 |
|---------|------|---------|
| `Could not connect to debug target` | Chrome 未启动或端口未开放 | 启动 Chrome 并添加 `--remote-debugging-port=9222` |
| `Page not found` | 页面 ID 无效 | 使用 `list_pages` 获取有效页面 |
| `Script execution failed` | JavaScript 错误 | 检查脚本语法和选择器 |
| `Navigation timeout` | 页面加载超时 | 检查网络，增加等待时间 |
| `Element not interactable` | 元素被遮挡或不可交互 | 滚动到可见区域，检查元素状态 |

> Chrome 启动命令请参考 [安装指南](./installation.md)

---

## 会话管理

### 检查连接状态
使用 `list_pages` 检查是否已连接：
- 成功返回页面列表 → 已连接
- 失败返回错误 → 需要启动 Chrome

### 多标签页管理
```
1. list_pages → 获取所有页面
2. 记录需要操作的 pageId
3. 在 API 调用时指定 pageId
```

### 保持登录状态
使用 `--user-data-dir` 参数启动 Chrome 可以：
- 保持 Cookie
- 保持登录状态
- 保持扩展程序