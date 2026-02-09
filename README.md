# Claude Skills Collection

一个用于 Claude Code 的自定义 Skills 集合，帮助提升 AI 辅助开发的效率。

## 什么是 Claude Skills?

Claude Skills 是 Claude Code 的扩展能力，通过 Markdown 文件定义特定任务的执行流程和输出格式，让 Claude 能够更好地理解和完成复杂任务。

## 安装使用

### 方法一：一键安装（推荐）

使用 `npx skills add` 命令一键安装：

```bash
npx skills add free-ride-car/fun-skills
```

**可选参数：**
- 指定安装到 Claude Code：`npx skills add free-ride-car/fun-skills -a claude-code`
- 仅安装特定 skill：`npx skills add free-ride-car/fun-skills --skill weekly-report`
- 查看可用 skills：`npx skills add free-ride-car/fun-skills --list`

### 方法二：全局安装

将 skills 目录复制到 Claude 配置目录：

```bash
# macOS/Linux
cp -r skills/* ~/.claude/skills/

# Windows (PowerShell)
Copy-Item -Recurse skills\* $env:USERPROFILE\.claude\skills\
```

### 方法三：项目级安装

将 skills 目录复制到项目的 `.claude/skills/` 目录下。

## Skills 列表

| Skill 名称 | 描述 | 使用场景 |
|-----------|------|---------|
| [git](skills/git/skill.md) | 智能代码提交助手 | 自动分析变更生成提交信息，支持本地提交和远程推送 |
| [weekly-report](skills/weekly-report/SKILL.md) | 周报生成器 | 根据 Git 提交记录自动生成工作周报 |

## Skill 文件结构

每个 Skill 包含一个 `SKILL.md` 文件，遵循以下结构：

```
skills/
└── skill-name/
    └── SKILL.md
```

### SKILL.md 格式

```markdown
---
name: skill-name
description: Skill 的简短描述
metadata:
  author: xxx
  version: "1.0"
---

# Skill 标题

详细的 Skill 说明和执行流程...
```

## 创建新 Skill

1. 在 `skills/` 目录下创建新文件夹
2. 在文件夹中创建 `SKILL.md` 文件
3. 参考 [TEMPLATE.md](TEMPLATE.md) 编写 Skill 内容

## 贡献指南

欢迎提交 Pull Request 贡献新的 Skills！

1. Fork 本仓库
2. 创建新的 Skill 分支
3. 按照模板编写 Skill
4. 提交 PR

## License

MIT License
