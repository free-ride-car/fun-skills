# 安装指南

Chrome Browser Skill 需要以下组件才能正常工作。

## 系统要求

| 组件 | 要求 |
|------|------|
| 操作系统 | Windows 10+, macOS 10.15+, Linux |
| 浏览器 | Google Chrome 90+ 或 Chromium |
| Node.js | 18+ (用于运行 MCP 服务) |
| Claude Code | 最新版本 |

## 版本兼容性

| 组件 | 最低版本 | 推荐版本 |
|------|---------|---------|
| Chrome | 90 | 最新稳定版 |
| chrome-devtools-mcp | 1.0.0 | 最新版 |
| MCP 协议 | 2024-11-05 | 最新版 |

> Chrome 90+ 支持 CDP 的现代特性，建议使用最新版以获得最佳兼容性。

## 安装步骤

### 步骤 1: 安装 chrome-devtools-mcp

打开终端，执行：

```bash
npx @anthropic-ai/mcp add chrome-devtools
```

或者手动安装：

```bash
npm install -g @anthropic-ai/chrome-devtools-mcp
```

### 步骤 2: 配置 Claude Code

编辑 Claude Code 配置文件：

**Windows**: `%USERPROFILE%\.claude\settings.json`

**macOS/Linux**: `~/.claude/settings.json`

添加以下配置：

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/chrome-devtools-mcp"]
    }
  }
}
```

如果已存在其他 MCP 服务，合并到 `mcpServers` 对象中：

```json
{
  "mcpServers": {
    "existing-service": { ... },
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/chrome-devtools-mcp"]
    }
  }
}
```

### 步骤 3: 重启 Claude Code

配置完成后，重启 Claude Code 使配置生效。

### 步骤 4: 验证安装

在 Claude Code 中，检查是否能使用 MCP 工具：
- 输入 `/mcp` 查看已加载的 MCP 服务
- 或直接尝试执行浏览器操作

### 步骤 5: 启动 Chrome 远程调试

每次使用前，需要以远程调试模式启动 Chrome：

**Windows (PowerShell)**:
```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="$env:TEMP\chrome-debug"
```

**Windows (CMD)**:
```cmd
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="%TEMP%\chrome-debug"
```

**macOS**:
```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug
```

**Linux**:
```bash
google-chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug
```

## 常见问题

### Q: MCP 工具未显示

**原因**: 配置文件位置错误或格式错误

**解决**:
1. 确认配置文件路径正确
2. 检查 JSON 格式是否有效
3. 重启 Claude Code

### Q: 无法连接到 Chrome

**原因**: Chrome 未以远程调试模式启动

**解决**:
1. 关闭所有 Chrome 窗口
2. 使用上述命令重新启动
3. 确保端口 9222 未被占用

### Q: npx 下载慢

**原因**: npm 源在国内访问慢

**解决**:
```bash
# 使用国内镜像
npm config set registry https://registry.npmmirror.com

# 或使用 cnpm
npm install -g cnpm --registry=https://registry.npmmirror.com
cnpm install -g @anthropic-ai/chrome-devtools-mcp
```

### Q: Chrome 已在运行，如何启用调试

**原因**: Chrome 只能在启动时启用远程调试

**解决**:
1. 完全关闭 Chrome（包括后台进程）
2. 使用远程调试参数重新启动

**Windows 检查后台进程**:
```powershell
taskkill /F /IM chrome.exe
```

**macOS/Linux 检查后台进程**:
```bash
pkill -f chrome
```

### Q: 端口 9222 被占用

**解决**:
```bash
# 查看端口占用（Windows）
netstat -ano | findstr :9222

# 查看端口占用（macOS/Linux）
lsof -i :9222

# 使用其他端口启动 Chrome
chrome.exe --remote-debugging-port=9223 ...
```

## 可选配置

### 使用用户数据目录

保留登录状态和书签：

```bash
# 使用现有的 Chrome 配置
chrome.exe --remote-debugging-port=9222

# 不推荐：可能影响正常使用的 Chrome
```

### 无头模式

不需要界面时使用：

```bash
chrome.exe --remote-debugging-port=9222 --headless --disable-gpu
```

### 固定用户目录

创建专用的调试配置目录：

**Windows**:
```cmd
chrome.exe --remote-debugging-port=9222 --user-data-dir="C:\chrome-debug-profile"
```

**macOS/Linux**:
```bash
chrome.exe --remote-debugging-port=9222 --user-data-dir="$HOME/.chrome-debug"
```