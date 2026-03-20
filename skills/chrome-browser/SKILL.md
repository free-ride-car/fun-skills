---
name: chrome-browser
description: 基于 Chrome DevTools MCP 的浏览器自动化 Skill。支持访问网站、执行操作、获取数据。当用户需要"打开网站"、"用浏览器访问"、"自动操作网页"、"点击按钮"、"填写表单"、"截取页面"时使用。
metadata:
  author: zhoujianting
  version: '1.0'
---

# Chrome Browser 自动化

通过 chrome-devtools-mcp 服务实现浏览器自动化操作，支持自然语言指令控制浏览器。

## 前置条件

- **Chrome 浏览器**：需要安装 Google Chrome
- **chrome-devtools-mcp**：MCP 服务，提供 CDP 能力

> 详细安装步骤请参考 [安装指南](./references/installation.md)。

## 使用场景

当用户请求以下内容时激活此 skill：

- "打开 www.example.com"、"访问这个网站"
- "在浏览器中搜索 xxx"、"帮我谷歌一下"
- "点击页面上的登录按钮"
- "填写这个表单"
- "截取当前页面"、"保存页面截图"
- "获取页面上的 xxx 数据"

## 执行流程

### 第一步：检查环境

尝试调用 MCP 工具检查 Chrome 浏览器连接状态。如果连接失败，提示用户启动 Chrome 远程调试模式。

> 无法连接到 Chrome 浏览器时，请以远程调试模式启动 Chrome：
>
> ```bash
> chrome.exe --remote-debugging-port=9222 --user-data-dir="%TEMP%\chrome-debug"
> ```

### 第二步：解析用户指令

根据用户输入，识别需要执行的操作：

| 用户意图      | 对应指令                          |
| ------------- | --------------------------------- |
| 打开/访问网站 | `navigate`                        |
| 点击元素      | `click`                           |
| 输入文本      | `type`                            |
| 搜索          | `type` + `click` 或 `press Enter` |
| 截图          | `screenshot`                      |
| 获取数据      | `evaluate`                        |
| 等待          | `wait`                            |
| 滚动          | `scroll`                          |

### 第三步：确定目标页面

- 如果用户指定了 URL → 导航到该地址
- 如果用户说"当前页面" → 使用当前活动标签
- 如果需要新建标签 → 使用 `new_page`

### 第四步：执行操作序列

按顺序执行解析出的操作指令。详见 [支持的指令](./references/commands.md)。

### 第五步：返回结果

根据操作类型返回结果：

- 导航类：返回页面标题和 URL
- 操作类：返回操作是否成功
- 获取类：返回获取的数据
- 截图类：返回截图并描述内容

## 常用操作速查

### 打开网站

```
用户: 打开 github.com
执行: navigate → https://github.com
返回: 已打开 GitHub 首页
```

### 搜索

```
用户: 在 Google 搜索 Chrome DevTools
执行:
  1. navigate → https://www.google.com
  2. type → 搜索框 → "Chrome DevTools"
  3. press → Enter
返回: 搜索结果页面截图
```

### 点击元素

```
用户: 点击页面上的"登录"按钮
执行:
  1. 分析页面找到登录按钮选择器
  2. click → 登录按钮选择器
返回: 点击结果
```

### 获取数据

```
用户: 获取页面标题
执行: evaluate → document.title
返回: 页面标题文本
```

## 错误处理

| 错误类型      | 处理方式                               |
| ------------- | -------------------------------------- |
| Chrome 未启动 | 提供启动命令，引导用户启动远程调试模式 |
| 页面加载超时  | 建议检查网络或增加等待时间             |
| 元素未找到    | 提示可能的原因，建议重新定位           |
| 脚本执行错误  | 返回错误信息，提供修复建议             |
| 权限问题      | 说明需要用户授权的操作                 |

## 注意事项

1. **浏览器启动**：Chrome 需要以 `--remote-debugging-port=9222` 启动
2. **等待加载**：复杂页面需要适当等待，避免操作过早执行
3. **选择器稳定性**：优先使用稳定的 ID、data 属性，避免使用易变的 class
4. **登录态**：涉及登录的网站需要用户提前登录或提供凭据
5. **页面变化**：SPA 页面可能需要监听 URL 或 DOM 变化

## 参考文档

| 文档                                      | 说明                       |
| ----------------------------------------- | -------------------------- |
| [安装指南](./references/installation.md)  | 详细安装步骤和常见问题     |
| [支持的指令](./references/commands.md)    | 所有可执行的浏览器操作指令 |
| [选择器策略](./references/selectors.md)   | 元素定位方法和最佳实践     |
| [浏览器 API](./references/browser-api.md) | MCP 工具对应关系           |
| [使用示例](./references/examples.md)      | 完整的交互示例             |

## 示例对话

**用户**: 帮我打开百度搜索 Claude AI

**助手**:

1. 连接浏览器...已连接
2. 打开百度...已完成
3. 输入搜索词...已输入 "Claude AI"
4. 执行搜索...已完成

搜索结果：找到约 X 条相关结果，以下是前几条...

---

**用户**: 获取当前页面的所有链接

**助手**:
执行脚本获取链接...

```javascript
Array.from(document.querySelectorAll('a[href]'))
  .map((a) => ({ text: a.textContent.trim(), href: a.href }))
  .filter((l) => l.text && l.href);
```

获取到 X 个链接：

- [链接文本](URL)
- ...
