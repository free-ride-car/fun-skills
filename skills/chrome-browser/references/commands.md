# 支持的指令

Chrome Browser Skill 支持以下浏览器操作指令。

## 导航类指令

### navigate - 页面导航

导航到指定 URL。

**参数**:
- `url` (必需): 目标 URL

**示例**:
```
用户: 打开 github.com
执行: navigate → https://github.com
```

### new_page - 新建标签页

创建新的浏览器标签页。

**参数**:
- `url` (可选): 新页面的初始 URL

### close_page - 关闭标签页

关闭当前或指定标签页。

### back / forward - 前进后退

浏览历史导航。

### refresh - 刷新页面

刷新当前页面。

---

## 交互类指令

### click - 点击元素

点击页面上的元素。

**参数**:
- `selector` (必需): CSS 选择器或 XPath
- `waitForNavigation` (可选): 是否等待页面跳转

**示例**:
```
用户: 点击登录按钮
执行: click → button[type="submit"]
```

### type - 输入文本

在输入框中输入文本。

**参数**:
- `selector` (必需): 输入框选择器
- `text` (必需): 要输入的文本
- `clear` (可选): 是否先清空输入框

**示例**:
```
用户: 在搜索框输入 "hello world"
执行: type → input[name="q"] → "hello world"
```

### press - 按键

模拟键盘按键。

**参数**:
- `key` (必需): 按键名称 (Enter, Tab, Escape, etc.)
- `selector` (可选): 目标元素

**常用按键**:
- `Enter` - 回车
- `Tab` - 制表符
- `Escape` - 退出
- `ArrowUp/Down/Left/Right` - 方向键
- `Control` + `c` - 复制
- `Control` + `v` - 粘贴

### scroll - 滚动页面

滚动页面到指定位置。

**参数**:
- `direction`: `up` / `down` / `top` / `bottom`
- `distance`: 滚动距离 (像素或 `viewport`)

**示例**:
```
用户: 向下滚动一屏
执行: scroll → down → viewport
```

### hover - 悬停

鼠标悬停在元素上。

**参数**:
- `selector` (必需): 目标元素选择器

---

## 获取类指令

### screenshot - 截图

截取页面或元素的截图。

**参数**:
- `selector` (可选): 元素选择器，不指定则为全页面
- `fullPage` (可选): 是否截取完整页面

### evaluate - 执行脚本

在页面上下文中执行 JavaScript 并返回结果。

**参数**:
- `script` (必需): JavaScript 代码

**常用脚本示例**:

```javascript
// 获取页面标题
document.title

// 获取所有链接
Array.from(document.querySelectorAll('a')).map(a => a.href)

// 获取元素文本
document.querySelector('.title')?.textContent

// 获取表单数据
Array.from(document.querySelectorAll('input')).map(i => ({ name: i.name, value: i.value }))
```

### get_content - 获取页面内容

获取页面的 HTML 内容。

**参数**:
- `selector` (可选): 元素选择器
- `type`: `html` / `text` / `markdown`

---

## 等待类指令

### wait - 等待

等待指定条件满足。

**参数**:
- `type`: 等待类型
  - `selector` - 等待元素出现
  - `navigation` - 等待页面跳转
  - `timeout` - 等待指定时间
  - `function` - 等待函数返回 true
- `value`: 选择器/时间(毫秒)/函数

**示例**:
```
用户: 等待加载完成
执行: wait → selector → .loading-spinner → hidden
```

---

## 高级指令

### upload - 上传文件

上传文件到 file input。

**参数**:
- `selector`: file input 选择器
- `filePath`: 文件路径

### select - 选择下拉选项

选择 select 元素的选项。

**参数**:
- `selector`: select 元素选择器
- `value`: 选项值或文本

### dialog - 处理对话框

处理 alert/confirm/prompt 对话框。

**参数**:
- `action`: `accept` / `dismiss`
- `text`: prompt 输入文本 (可选)

---

## 指令组合示例

### 搜索操作
```
navigate → https://google.com
type → input[name="q"] → "search term"
press → Enter
wait → navigation
screenshot
```

### 表单填写
```
type → #username → "user@example.com"
type → #password → "password123"
click → button[type="submit"]
wait → navigation
```

### 数据抓取
```
navigate → https://example.com/data
wait → selector → .data-table
evaluate → 抓取脚本
```