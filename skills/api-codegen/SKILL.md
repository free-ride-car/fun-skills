---
name: api-codegen
description: 根据接口 URL 自动查找文档并生成 TypeScript 接口函数代码
metadata:
  author: zhoujianting
  version: "1.0"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Write
  - Edit
  - Bash
---

# API 接口封装技能

根据输入的接口 URL，自动查找对应的接口文档并封装成 TypeScript 接口函数。

## 触发条件

- `/api-codegen /api/xxx`
- `封装接口 /api/xxx`
- `帮我封装这个接口：/api/xxx`

## 配置

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| 文档目录 | `\\Zengjie\开发共享\智汇\API` | 可通过 `--docs <目录>` 指定自定义目录 |

## 执行步骤

### 1. 解析用户输入

从用户输入中提取：
- **接口 URL**：例如 `/zhihui/geoReport/domainRank`
- **文档目录**（可选）：如果用户指定了目录则使用指定目录，否则使用默认目录 `\\Zengjie\开发共享\智汇\API`

### 2. 查找接口文档

在文档目录下查找对应的接口文档：

**文档命名规则：**
- 取接口 URL 的最后两个路径段，用 `-` 连接
- 例如：`/zhihui/geoReport/domainRank` → `geoReport-domainRank.md`
- 例如：`/zhihui/geoReport/getSubProjectList` → `geoReport-getSubProjectList.md`

**查找策略（按优先级顺序）：**
1. **精确匹配文件名**：在文档目录下查找 `{倒数第二段}-{最后一段}.md`
2. **内容匹配**：遍历目录下所有 `.md` 文件，匹配 `## 接口信息` 表格中的 `接口URL` 字段
3. **MCP API 文档查找**：通过 `mcp__API_____read_project_oas_r3ac2t` 工具读取 OpenAPI Spec，查找匹配的接口路径

### 3. 解析接口文档

文档格式遵循 [API_DOC_STANDARD.md](references/API_DOC_STANDARD.md) 规范，从文档中提取：

| 信息 | 位置 |
|------|------|
| 接口名称 | `## 接口信息` 表格中的 `接口名称` |
| 接口描述 | `## 接口信息` 表格中的 `接口描述` |
| 请求方式 | `## 接口信息` 表格中的 `请求方式` (GET/POST/PUT/DELETE) |
| 请求参数 | `## 请求参数` 下的 `### Body（JSON）` 或 `### Query Parameters` 表格 |
| 响应数据 | `## 响应数据` 下的 JSON 示例和 `## 字段说明` 表格 |

### 4. 生成 TypeScript 接口代码

**类型定义规则：**
- 复杂嵌套结构定义独立 interface，命名：`XxxResult`
- 分页响应定义 `PageData` 接口，包含 `records`、`total`、`size`、`current`、`pages`

### 5. 代码规范

**函数命名：**
- 前缀 `req` + 接口名称（驼峰式）
- 例如：`domainRank` → `reqGetDomainRank`
- **注意**：如果接口 URL 的最后一个单词比较简短（如 `add`、`delete`、`get`、`list`、`update` 等常见动词），需要拼接最后两个单词
  - 例如：`/geo/report/add` → `reqAddReport`（add 较短，拼接为 AddReport）
  - 例如：`/geo/getDomainRank` → `reqGetDomainRank`（getDomainRank 较长，直接使用）

**请求方式处理：**
| 请求方式 | 参数名 | Content-Type |
|----------|--------|--------------|
| GET | params | 无需设置 |
| POST (JSON) | data | `ContentTypeEnum.JSON` |
| POST (表单) | data | `ContentTypeEnum.FORM_URLENCODED` |

**参数类型映射：**
| 文档类型 | TypeScript 类型 |
|----------|-----------------|
| string | string |
| integer | number |
| number | number |
| boolean | boolean |
| array | T[] |
| string[] | string[] |
| object | 定义 interface |

**必填/可选处理：**
- 文档中 `是否必填` 为 `是` → 必填参数
- 文档中 `是否必填` 为 `否` → 可选参数（加 `?`）

### 6. 导入依赖

确保目标文件顶部有必要的导入：
```typescript
import { request } from '@/core/service'
import { ContentTypeEnum } from '@/core/service/Axios'
```

## 示例

**输入：** `/api-codegen /api/user/list`

**生成代码：**
```typescript
export interface UserResult {
    /** 用户ID */
    id: string
    /** 用户名 */
    name: string
}

/** 获取用户列表 */
export const reqGetUserList = (data: {
    /** 页码 */
    pageNum?: number
    /** 每页数量 */
    pageSize?: number
}): Promise<{
    success: boolean
    data: UserResult[]
}> => {
    return request.post({
        url: '/api/user/list',
        data
    })
}
```

## 错误处理

- 如果找不到对应的接口文档，提示用户文档不存在，并询问是否手动提供接口信息
- 如果文档格式不符合规范，尝试智能解析，并提示用户确认
