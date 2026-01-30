# 参数配置

## 必要参数

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `author` | **提交人过滤** - Git 用户名或邮箱，只统计该作者的提交 | 当前 git config user.name |

## 可选参数

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `since` | 开始日期 | 7 days ago |
| `until` | 结束日期 | now |
| `format` | 输出格式 (markdown/text/html) | markdown |
| `output` | 输出位置 (display/file) | display |
