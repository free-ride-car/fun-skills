---
name: weekly-report
description: 根据 Git 提交记录和代码变更自动生成个人周报。当用户要求生成周报、工作总结、或者汇总本周工作内容时使用此 skill。支持自定义时间范围、提交人过滤、输出格式和详细程度。
metadata:
  author: zhoujianting
  version: "1.0"
---

# 周报生成器 (Weekly Report Generator)

根据 Git 提交历史和代码变更，自动生成结构化的个人工作周报。

## 使用场景

当用户请求以下内容时激活此 skill：
- "生成周报"、"写周报"、"本周工作总结"
- "汇总这周的提交"、"总结代码变更"
- "生成工作报告"、"导出开发日志"

## 参考文档

| 文档 | 说明 |
|------|------|
| [参数配置](./references/parameters.md) | 必要参数和可选参数说明 |
| [执行流程](./references/execution-flow.md) | 数据收集和分析步骤 |
| [输出格式](./references/output-format.md) | 周报 Markdown 模板 |
| [自定义选项](./references/custom-options.md) | 用户确认项和可选配置 |
| [高级功能](./references/advanced-features.md) | 多仓库支持和智能增强 |

## 示例对话

**用户**: 帮我生成本周的周报

**助手**:
> 检测到当前 Git 用户为 **zhangsan**，将为该用户生成周报，确认吗？

**用户**: 确认

**助手**: 正在收集提交记录...
（按 [输出格式](./references/output-format.md) 生成周报）
