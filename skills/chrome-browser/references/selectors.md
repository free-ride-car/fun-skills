# 选择器策略

在浏览器自动化中，正确定位元素是关键。本文档介绍元素选择器的使用策略。

## 选择器类型

### 1. CSS 选择器 (推荐)

最常用且易于理解的选择器方式。

**按 ID 选择** (最稳定):
```css
#submit-button
#main-content
```

**按 class 选择**:
```css
.btn-primary
.form-input
.nav-link.active
```

**按属性选择**:
```css
[data-testid="login-button"]
[name="email"]
[type="submit"]
[href*="github"]
```

**组合选择器**:
```css
form#login .btn-submit
nav > ul > li:first-child
input[type="text"][placeholder*="搜索"]
```

### 2. XPath 选择器

用于复杂的 DOM 结构遍历。

```xpath
// 按文本内容选择
//button[contains(text(), '登录')]

// 按部分属性选择
//input[contains(@placeholder, '请输入')]

// 按层级关系选择
//div[@class='container']//a[@href]

// 按位置选择
//ul/li[1]
//table/tr[last()]
```

### 3. 文本选择器

直接通过元素文本内容定位。

```
text=登录
text=/提交/i  // 支持正则
```

---

## 选择器优先级

选择稳定、不易变化的选择器：

| 优先级 | 选择器类型 | 示例 | 稳定性 |
|-------|-----------|------|--------|
| 1 | ID | `#submit-btn` | 最高 |
| 2 | data-testid | `[data-testid="login"]` | 很高 |
| 3 | name 属性 | `[name="email"]` | 高 |
| 4 | ARIA 属性 | `[aria-label="搜索"]` | 高 |
| 5 | 组合属性 | `input[type="submit"]` | 中 |
| 6 | class 组合 | `.btn.btn-primary` | 中 |
| 7 | 文本内容 | `text=登录` | 低 |
| 8 | 单一 class | `.submit` | 很低 |
| 9 | DOM 结构 | `div > div > button` | 最低 |

---

## 常见元素选择器

### 按钮
```css
button[type="submit"]
input[type="submit"]
.btn-primary
/* 注意：以下为 jQuery/Playwright 语法，标准 CSS 不支持 */
/* button:contains("登录") */
```

**按文本选择按钮**（标准方式）:
```xpath
// 使用 XPath
//button[contains(text(), '登录')]
```

### 输入框
```css
input[type="text"]
input[type="email"]
input[name="username"]
input[placeholder*="请输入"]
```

### 链接
```css
a[href="/login"]
a:contains("更多信息")
nav a
```

### 表单
```css
form#login-form
form[action="/submit"]
```

### 列表项
```css
ul > li
.list-item
[data-role="list-item"]
```

---

## 动态元素处理

### 等待元素出现
```
wait → selector → .dynamic-content → visible
```

### 等待元素消失
```
wait → selector → .loading-spinner → hidden
```

### 处理 iframe
```
// 切换到 iframe
frame → iframe-selector
// 执行操作
click → button
// 切回主框架
frame → main
```

---

## 调试选择器

### 验证选择器
在浏览器控制台执行：
```javascript
// 检查选择器是否唯一
document.querySelectorAll('你的选择器').length

// 查看匹配的元素
document.querySelectorAll('你的选择器')

// 测试 XPath
$x('你的 XPath')
```

### 常见问题

**问题**: 选择器匹配到多个元素
**解决**: 使用更具体的选择器或使用 `:first-child`、`:nth-child(n)`

**问题**: 元素在 iframe 内
**解决**: 先切换到 iframe 再操作

**问题**: 元素动态生成
**解决**: 使用 `wait` 等待元素出现

**问题**: class 名是动态的 (如 `css-abc123`)
**解决**: 避免使用动态 class，改用稳定的属性或文本内容

---

## 最佳实践

1. **优先使用语义化选择器**
   - 好的: `[data-testid="submit"]`
   - 差的: `.css-1a2b3c`

2. **保持选择器简洁**
   - 好的: `#submit-btn`
   - 差的: `body > div > div > form > button`

3. **使用有意义的属性**
   - 好的: `[aria-label="提交表单"]`
   - 差的: `.btn` (太通用)

4. **考虑响应式布局**
   - 移动端和桌面端选择器可能不同

5. **考虑国际化**
   - 避免硬编码特定语言的文本选择器