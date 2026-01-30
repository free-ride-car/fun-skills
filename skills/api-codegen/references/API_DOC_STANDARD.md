# 后端接口文档标准规范

## 一、文档概述

### 1.1 编写目的
本文档旨在规范后端API接口文档的编写格式，确保接口文档的完整性、一致性和可读性，便于前端开发人员快速理解和使用接口。

### 1.2 适用范围
本文档适用于所有RESTful API接口的文档编写。

---

## 二、接口命名规范

### 2.1 命名原则
- 使用小写字母
- 多个单词使用连字符 `-` 或下划线 `_` 连接
- 采用 `动词 + 名词` 的组合形式
- 遵循RESTful风格

### 2.2 常用动词
| 动词 | 说明 | HTTP方法 |
|------|------|----------|
| get | 获取资源 | GET |
| create/create | 创建资源 | POST |
| update/update | 更新资源 | PUT/PATCH |
| delete/delete | 删除资源 | DELETE |
| list | 获取资源列表 | GET |
| search/search | 搜索资源 | GET/POST |

### 2.3 文档文件命名规范
基于本规范创建的接口文档文件，必须使用接口URL进行命名。

**命名规则：**
- 将接口URL中的路径分隔符 `/` 替换为 `-`
- 去除开头的 `/api/v1/` 或 `/api/` 等版本前缀
- 文件扩展名为 `.md`

**命名示例：**

| 接口URL | 文档文件名 |
|---------|-----------|
| `/api/v1/users` | `users.md` |
| `/api/v1/users/{userId}` | `users-userId.md` |
| `/api/v1/user/info` | `user-info.md` |
| `/api/v1/order/create` | `order-create.md` |
| `/api/v1/goods/search` | `goods-search.md` |

---

## 三、接口文档模板

### 3.1 基础信息

#### 3.1.1 接口概述
| 字段 | 说明 | 示例 |
|------|------|------|
| **接口名称** | 接口的功能描述 | 获取用户信息 |
| **接口URL** | 接口的请求地址 | /api/v1/user/info |
| **请求方式** | HTTP请求方法 | GET |
| **接口描述** | 接口的详细说明 | 根据用户ID获取用户基本信息 |

#### 3.1.2 请求参数

**路径参数（Path Parameters）**

| 参数名 | 类型 | 是否必填 | 默认值 | 说明 |
|--------|------|----------|--------|------|
| userId | string | 是 | - | 用户ID |

**查询参数（Query Parameters）**

| 参数名 | 类型 | 是否必填 | 默认值 | 说明 |
|--------|------|----------|--------|------|
| fields | string | 否 | id,name,avatar | 需要返回的字段，逗号分隔 |
| lang | string | 否 | zh-CN | 语言设置 |

**请求体参数（Body Parameters）**

| 参数名 | 类型 | 是否必填 | 默认值 | 说明 |
|--------|------|----------|--------|------|
| name | string | 是 | - | 用户名称 |
| email | string | 是 | - | 用户邮箱 |
| age | integer | 否 | 18 | 用户年龄 |

#### 3.1.3 参数类型定义

| 类型 | 说明 | 示例 |
|------|------|------|
| string | 字符串 | "hello" |
| integer | 整数 | 123 |
| number | 数字（含小数） | 123.45 |
| boolean | 布尔值 | true / false |
| array | 数组 | [1, 2, 3] |
| object | 对象 | {"key": "value"} |
| file | 文件 | 二进制文件 |

#### 3.1.4 响应数据

**成功响应（200 OK）**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "userId": "12345",
    "name": "张三",
    "email": "zhangsan@example.com",
    "age": 25,
    "avatar": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

**失败响应（400 Bad Request）**

```json
{
  "code": 400,
  "message": "参数错误",
  "data": {
    "errors": [
      {
        "field": "email",
        "message": "邮箱格式不正确"
      }
    ]
  }
}
```

**字段说明**

| 字段 | 类型 | 说明 |
|------|------|------|
| code | integer | 响应状态码，200表示成功 |
| message | string | 响应消息 |
| data | object/array | 响应数据 |
| userId | string | 用户ID |
| name | string | 用户名称 |
| email | string | 用户邮箱 |
| age | integer | 用户年龄 |
| avatar | string | 用户头像URL |
| createdAt | string | 创建时间，ISO 8601格式 |

---

## 四、完整示例

### 4.1 创建资源（POST）

#### 接口信息

| 字段 | 值 |
|------|-----|
| **接口名称** | 创建用户 |
| **接口URL** | /api/v1/users |
| **请求方式** | POST |
| **接口描述** | 创建新用户账号 |

#### 请求参数

**Headers**

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| Content-Type | string | 是 | 固定值：application/json |
| Authorization | string | 是 | Bearer {token} |

**Body（JSON）**

| 参数名 | 类型 | 是否必填 | 默认值 | 说明 |
|--------|------|----------|--------|------|
| name | string | 是 | - | 用户名称，2-20个字符 |
| email | string | 是 | - | 用户邮箱，需符合邮箱格式 |
| password | string | 是 | - | 用户密码，6-20个字符 |
| phone | string | 否 | - | 手机号码 |
| avatar | string | 否 | - | 头像URL |
| role | string | 否 | user | 用户角色：user/admin |

#### 请求示例

```bash
curl -X POST https://api.example.com/api/v1/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "张三",
    "email": "zhangsan@example.com",
    "password": "123456",
    "phone": "13800138000",
    "avatar": "https://example.com/default-avatar.jpg",
    "role": "user"
  }'
```

#### 响应数据

**成功响应（201 Created）**

```json
{
  "code": 201,
  "message": "创建成功",
  "data": {
    "userId": "usr_1234567890",
    "name": "张三",
    "email": "zhangsan@example.com",
    "phone": "13800138000",
    "avatar": "https://example.com/default-avatar.jpg",
    "role": "user",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**失败响应（409 Conflict - 邮箱已存在）**

```json
{
  "code": 409,
  "message": "邮箱已被注册",
  "data": {
    "errorCode": "EMAIL_ALREADY_EXISTS",
    "field": "email",
    "value": "zhangsan@example.com"
  }
}
```

#### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| userId | string | 用户唯一标识 |
| name | string | 用户名称 |
| email | string | 用户邮箱 |
| phone | string | 手机号码 |
| avatar | string | 头像URL |
| role | string | 用户角色 |
| status | string | 账号状态：active/inactive/banned |
| createdAt | string | 创建时间（ISO 8601） |
| updatedAt | string | 更新时间（ISO 8601） |

---

### 4.2 获取资源列表（GET）

#### 接口信息

| 字段 | 值 |
|------|-----|
| **接口名称** | 获取用户列表 |
| **接口URL** | /api/v1/users |
| **请求方式** | GET |
| **接口描述** | 分页获取用户列表，支持筛选和排序 |

#### 请求参数

**Headers**

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| Authorization | string | 是 | Bearer {token} |

**Query Parameters**

| 参数名 | 类型 | 是否必填 | 默认值 | 说明 |
|--------|------|----------|--------|------|
| page | integer | 否 | 1 | 页码，从1开始 |
| pageSize | integer | 否 | 20 | 每页数量，范围1-100 |
| status | string | 否 | - | 状态筛选：active/inactive/banned |
| role | string | 否 | - | 角色筛选：user/admin |
| keyword | string | 否 | - | 搜索关键词（姓名/邮箱） |
| sortBy | string | 否 | createdAt | 排序字段 |
| sortOrder | string | 否 | desc | 排序方向：asc/desc |

#### 请求示例

```bash
curl -X GET "https://api.example.com/api/v1/users?page=1&pageSize=20&status=active&role=user&sortBy=createdAt&sortOrder=desc" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 响应数据

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 150,
    "page": 1,
    "pageSize": 20,
    "pages": 8,
    "items": [
      {
        "userId": "usr_1234567890",
        "name": "张三",
        "email": "zhangsan@example.com",
        "phone": "13800138000",
        "avatar": "https://example.com/avatar1.jpg",
        "role": "user",
        "status": "active",
        "createdAt": "2024-01-15T10:30:00Z"
      },
      {
        "userId": "usr_0987654321",
        "name": "李四",
        "email": "lisi@example.com",
        "phone": "13900139000",
        "avatar": "https://example.com/avatar2.jpg",
        "role": "user",
        "status": "active",
        "createdAt": "2024-01-14T15:20:00Z"
      }
    ]
  }
}
```

#### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| total | integer | 总记录数 |
| page | integer | 当前页码 |
| pageSize | integer | 每页记录数 |
| pages | integer | 总页数 |
| items | array | 用户列表数据 |

---

### 4.3 获取单个资源（GET）

#### 接口信息

| 字段 | 值 |
|------|-----|
| **接口名称** | 获取用户详情 |
| **接口URL** | /api/v1/users/{userId} |
| **请求方式** | GET |
| **接口描述** | 根据用户ID获取用户详细信息 |

#### 请求参数

**路径参数**

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| userId | string | 是 | 用户ID |

#### 请求示例

```bash
curl -X GET "https://api.example.com/api/v1/users/usr_1234567890" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 响应数据

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "userId": "usr_1234567890",
    "name": "张三",
    "email": "zhangsan@example.com",
    "phone": "13800138000",
    "avatar": "https://example.com/avatar.jpg",
    "role": "user",
    "status": "active",
    "profile": {
      "gender": "male",
      "birthday": "1990-01-01",
      "bio": "这是我的个人简介",
      "location": "北京市"
    },
    "stats": {
      "followers": 100,
      "following": 50,
      "posts": 20
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "lastLoginAt": "2024-01-20T08:15:00Z"
  }
}
```

---

### 4.4 更新资源（PUT/PATCH）

#### 接口信息

| 字段 | 值 |
|------|-----|
| **接口名称** | 更新用户信息 |
| **接口URL** | /api/v1/users/{userId} |
| **请求方式** | PUT |
| **接口描述** | 更新指定用户的信息（全部字段） |

#### 请求参数

**路径参数**

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| userId | string | 是 | 用户ID |

**Body（JSON）**

| 参数名 | 类型 | 是否必填 | 默认值 | 说明 |
|--------|------|----------|--------|------|
| name | string | 否 | - | 用户名称 |
| email | string | 否 | - | 用户邮箱 |
| phone | string | 否 | - | 手机号码 |
| avatar | string | 否 | - | 头像URL |
| status | string | 否 | - | 状态：active/inactive/banned |

#### 请求示例

```bash
curl -X PUT "https://api.example.com/api/v1/users/usr_1234567890" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "张三（更新）",
    "phone": "13800138001",
    "avatar": "https://example.com/new-avatar.jpg"
  }'
```

#### 响应数据

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "userId": "usr_1234567890",
    "name": "张三（更新）",
    "email": "zhangsan@example.com",
    "phone": "13800138001",
    "avatar": "https://example.com/new-avatar.jpg",
    "role": "user",
    "status": "active",
    "updatedAt": "2024-01-20T10:30:00Z"
  }
}
```

---

### 4.5 删除资源（DELETE）

#### 接口信息

| 字段 | 值 |
|------|-----|
| **接口名称** | 删除用户 |
| **接口URL** | /api/v1/users/{userId} |
| **请求方式** | DELETE |
| **接口描述** | 删除指定用户（软删除） |

#### 请求参数

**路径参数**

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| userId | string | 是 | 用户ID |

**Query Parameters**

| 参数名 | 类型 | 是否必填 | 默认值 | 说明 |
|--------|------|----------|--------|------|
| permanent | boolean | 否 | false | 是否永久删除 |

#### 请求示例

```bash
curl -X DELETE "https://api.example.com/api/v1/users/usr_1234567890?permanent=false" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 响应数据

```json
{
  "code": 200,
  "message": "删除成功",
  "data": {
    "userId": "usr_1234567890",
    "deleted": true,
    "deletedAt": "2024-01-20T10:30:00Z"
  }
}
```

---

## 五、通用响应状态码

| 状态码 | 说明 | 示例场景 |
|--------|------|----------|
| 200 | OK | 请求成功 |
| 201 | Created | 资源创建成功 |
| 204 | No Content | 删除成功（无返回内容） |
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未授权，需要登录 |
| 403 | Forbidden | 无权限访问 |
| 404 | Not Found | 资源不存在 |
| 409 | Conflict | 资源冲突（如邮箱已存在） |
| 422 | Unprocessable Entity | 参数验证失败 |
| 429 | Too Many Requests | 请求过于频繁（限流） |
| 500 | Internal Server Error | 服务器内部错误 |
| 502 | Bad Gateway | 网关错误 |
| 503 | Service Unavailable | 服务不可用 |

---

## 六、文档编写检查清单

### 接口基础信息
- [ ] 接口名称
- [ ] 接口URL
- [ ] 请求方式
- [ ] 接口描述

### 请求参数
- [ ] Headers参数完整
- [ ] 路径参数完整（含类型、必填、说明）
- [ ] 查询参数完整（含类型、必填、默认值、说明）
- [ ] 请求体参数完整（含类型、必填、默认值、说明）
- [ ] 提供请求示例（cURL/代码）

### 响应数据
- [ ] 成功响应示例
- [ ] 失败响应示例（至少2种常见错误场景）
- [ ] 响应字段说明（含字段名、类型、说明）

### 其他
- [ ] 错误码说明
- [ ] 注意事项/特殊说明
- [ ] 更新日期和版本号

---

## 七、注意事项

1. **时间格式**：统一使用 ISO 8601 格式，如 `2024-01-15T10:30:00Z`
2. **金额字段**：建议使用整数（单位：分）或字符串，避免浮点数精度问题
3. **分页参数**：page 从 1 开始计数
4. **布尔值**：使用小写 `true`/`false`
5. **空值**：使用 `null` 表示空值，不要省略字段
6. **枚举值**：在文档中明确列出所有可选值
7. **版本控制**：URL中包含版本号，如 `/api/v1/`
8. **限流说明**：如有API限流，需说明限流规则
9. **敏感数据**：密码等敏感字段不应在响应中返回
10. **ID规范**：ID字段命名建议使用驼峰式，如 `userId`、`orderId`

---

*文档版本：v1.0*
*更新日期：2024-01-15*
