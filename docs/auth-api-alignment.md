# 注册接口对接要求

## 目标

`yudao-ui-admin-front` 的注册能力需要结合 `ruoyi-vue-pro` 和已有管理端前端实现，对接 Yudao 原后台注册接口，并保持注册参数、请求路径和租户处理方式一致。

## 注册接口

| 对照项 | 要求 |
| --- | --- |
| 接口基础地址 | `VITE_YUDAO_ADMIN_API_BASE`，默认 `http://localhost:48080/admin-api` |
| 注册路径 | `POST /system/auth/register` |
| 注册前置步骤 | 先调用 `GET /system/tenant/get-id-by-name?name={tenantName}` 获取并保存 `tenant-id` |
| 请求 Header | `tenant-id: <租户 ID>`、`Content-Type: application/json` |
| 成功返回 | Yudao `AuthToken`，包含 `userId`、`accessToken`、`refreshToken`、`expiresTime` 等字段 |
| 成功后行为 | 保存 Token，并加载用户资料 |

## 注册参数

`front` 注册提交参数必须和原注册接口保持一致：

```json
{
  "tenantName": "芋道源码",
  "username": "user001",
  "nickname": "用户昵称",
  "password": "123456",
  "captchaVerification": ""
}
```

字段说明：

| 字段 | 要求 |
| --- | --- |
| `tenantName` | 租户名称，注册前用于换取 `tenant-id` |
| `username` | 用户账号，保持后端校验规则：4-30 位数字或字母 |
| `nickname` | 用户昵称，不能为空，最长 30 个字符 |
| `password` | 密码，保持后端校验规则：4-16 位 |
| `captchaVerification` | 图片验证码校验结果；当前本地联调关闭图片验证码时传空字符串 |

## 前端实现位置

| 文件 | 职责 |
| --- | --- |
| `src/services/authService.ts` | 提供 `register(params)`，负责获取租户 ID、调用 `/system/auth/register`、保存登录态 |
| `src/services/apiClient.ts` | 统一管理 `admin-api` 请求、`tenant-id` 和 Token Header |
| `src/components/AppLayout.vue` | 注册弹窗表单，收集 `tenantName`、`username`、`nickname`、`password`、`confirmPassword` |
| `src/services/marketConfig.ts` | 首页注册说明文案 |

## 本地联调约定

1. 后端 `ruoyi-vue-pro/yudao-server/src/main/resources/application.yaml` 关闭图片验证码：
   `yudao.captcha.enable=false`。
2. 注册前会按租户名称查询租户编号；默认租户名称为 `VITE_APP_DEFAULT_LOGIN_TENANT`，未配置时使用 `芋道源码`。
3. 注册成功后使用返回 Token 自动进入登录态。
4. 登录仍使用原管理端账号密码接口：`POST /system/auth/login`，参数为 `username`、`password`、`captchaVerification`。
