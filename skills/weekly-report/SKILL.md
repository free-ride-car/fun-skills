---
name: weekly-report
description: 根据 Git 提交记录和代码变更自动生成个人周报。当用户要求生成周报、工作总结、或者汇总本周工作内容时使用此 skill。支持自定义时间范围、提交人过滤、输出格式和详细程度。
---

# 周报生成器 (Weekly Report Generator)

根据 Git 提交历史和代码变更，自动生成结构化的个人工作周报。

## 使用场景

当用户请求以下内容时激活此 skill：
- "生成周报"、"写周报"、"本周工作总结"
- "汇总这周的提交"、"总结代码变更"
- "生成工作报告"、"导出开发日志"

## 参数配置

### 必要参数

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `author` | **提交人过滤** - Git 用户名或邮箱，只统计该作者的提交 | 当前 git config user.name |

### 可选参数

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `since` | 开始日期 | 7 days ago |
| `until` | 结束日期 | now |
| `format` | 输出格式 (markdown/text/html) | markdown |
| `output` | 输出位置 (display/file) | display |

## 执行流程

### 第零步：确认提交人

**重要**：在收集数据前，必须先确认报告的目标作者。

1. 检查用户是否指定了作者
2. 如未指定，获取当前 Git 配置的用户名和邮箱
3. **询问用户确认**：是否使用该用户名生成周报

```bash
# 获取当前 Git 用户信息
git config user.name
git config user.email
```

**确认对话示例**：
> 检测到当前 Git 用户为 **zhoujianting** (zhoujianting@example.com)
> 是否为该用户生成周报？或指定其他用户名/邮箱？

### 第一步：收集 Git 数据

使用 `--author` 参数过滤特定提交人的记录：

1. **获取提交记录**（默认最近 7 天）
```bash
# 使用用户名过滤
git log --since="7 days ago" --author="用户名" --pretty=format:"%h|%ad|%s" --date=short

# 或使用邮箱过滤（更精确）
git log --since="7 days ago" --author="user@email.com" --pretty=format:"%h|%ad|%s" --date=short
```

2. **获取代码变更统计**
```bash
git log --since="7 days ago" --author="用户名" --stat --pretty=format:"%h %s"
```

3. **获取变更文件列表**
```bash
git log --since="7 days ago" --author="用户名" --name-status --pretty=format:""
```

4. **按日期分组统计**
```bash
git log --since="7 days ago" --author="用户名" --format="%ad" --date=short | sort | uniq -c
```

### 第二步：分析与分类

将收集的数据按以下维度分类：

1. **工作类型分类**（根据 commit message 关键词）
   - 🚀 **新功能**: feat, add, new, implement, 新增, 添加, 实现
   - 🐛 **问题修复**: fix, bug, repair, 修复, 解决
   - ♻️ **代码重构**: refactor, optimize, improve, 重构, 优化
   - 📝 **文档更新**: docs, readme, comment, 文档, 注释
   - 🎨 **样式调整**: style, css, ui, 样式, 界面
   - ✅ **测试相关**: test, spec, 测试
   - 🔧 **配置变更**: config, build, ci, 配置
   - 📦 **依赖更新**: deps, package, upgrade, 依赖, 升级

2. **影响范围分析**
   - 统计修改的文件数量
   - 统计代码行数变更（新增/删除）
   - 识别主要修改的模块/目录

3. **时间分布**
   - 按天统计提交数量
   - 识别高产出日期

### 第三步：生成周报

## 周报输出格式

```markdown
# 工作周报

**报告周期**: YYYY-MM-DD ~ YYYY-MM-DD
**报告人**: [指定的用户名]
**邮箱**: [用户邮箱]
**项目**: [项目名称]

---

## 📊 本周概览

| 指标 | 数据 |
|------|------|
| 提交次数 | XX 次 |
| 修改文件 | XX 个 |
| 新增代码 | +XXX 行 |
| 删除代码 | -XXX 行 |
| 活跃天数 | X 天 |

---

## 🎯 主要工作内容

### 🚀 新功能开发
- [功能描述1] (commit hash)
- [功能描述2] (commit hash)

### 🐛 问题修复
- [问题描述1] (commit hash)
- [问题描述2] (commit hash)

### ♻️ 代码优化
- [优化描述1] (commit hash)

### 📝 其他工作
- [其他工作描述]

---

## 📁 主要变更模块

| 模块/目录 | 变更文件数 | 说明 |
|-----------|-----------|------|
| src/components | X | 组件开发 |
| src/pages | X | 页面更新 |

---

## 📅 每日工作记录

### YYYY-MM-DD (周X)
- commit message 1
- commit message 2

### YYYY-MM-DD (周X)
- commit message 1

---

## 📋 下周计划

> [可选：用户可补充下周计划]

---

## 💡 备注

> [可选：用户可补充其他说明]
```

## 自定义选项

在生成周报前，确认以下参数：

1. **提交人** ⭐ 必须确认
   - 当前 Git 用户（默认）
   - 指定用户名
   - 指定邮箱

2. **时间范围**
   - 本周（默认）
   - 自定义日期范围
   - 最近 N 天

3. **输出格式**
   - Markdown（默认）
   - 纯文本
   - HTML

4. **详细程度**
   - 简洁版：仅包含概览和主要工作
   - 标准版：包含完整分类（默认）
   - 详细版：包含每个 commit 的详细信息

5. **输出位置**
   - 直接显示
   - 保存到文件（如 `weekly-report-YYYY-MM-DD.md`）

## 多仓库支持

如果用户在多个项目工作，提供以下选项：
- 生成当前仓库的周报
- 指定多个仓库路径，合并生成周报
- 分别生成每个仓库的周报

**注意**：多仓库模式下，使用相同的 author 参数过滤所有仓库的提交。

## 智能增强

1. **Commit Message 优化**
   - 将英文 commit message 翻译为中文
   - 将简短的 message 扩展为完整描述
   - 合并相似的 commit 为一条工作项

2. **工作量评估**
   - 根据代码变更量评估工作复杂度
   - 识别重点/核心工作项

3. **趋势分析**（如有历史数据）
   - 与上周对比
   - 提交频率趋势

## 示例对话

### 示例 1：默认用户

**用户**: 帮我生成本周的周报

**助手**: 好的，我来帮你生成本周的工作周报。

首先确认一下提交人信息：
> 检测到当前 Git 用户为 **zhoujianting**
> 将为该用户生成周报，确认吗？

**用户**: 确认

**助手**: 正在收集 zhoujianting 的提交记录...
[生成周报]

### 示例 2：指定用户

**用户**: 帮我生成 zhangsan 的周报

**助手**: 好的，我将为 **zhangsan** 生成本周工作周报。

正在收集提交记录...
[生成周报]

### 示例 3：使用邮箱

**用户**: 生成周报，作者邮箱是 dev@company.com

**助手**: 好的，我将为邮箱 **dev@company.com** 对应的用户生成周报。

正在收集提交记录...
[生成周报]
