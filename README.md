# OCS 网课助手

单文件油猴/脚本猫脚本（`OCS 网课助手.user.js`），保留原脚本全部功能（超星/知到/职教云/MOOC/雨课堂 的作业与章节测试答题、视频挂机、面板配置等）。

自 `4.15.3-ai.16` 起的功能变更：**知识库改为 API 接入自建后端网关**，不再在浏览器本地解析/存储资料；脚本设置面板中可勾选哪些后端知识库参与答题（交互参照腾讯 ima 的知识库选择器）。`ai.18` 起对接标准知识库网关（`/api/v1/*`，Bearer 鉴权）。

## 知识库网关对接

设置项「知识库 API 地址」填网关基址（如 `http://<服务器IP>:8080`，只到端口、不带 `/api` 等后缀）；「知识库 API Key」填网关凭证，以 `Authorization: Bearer <key>` 发送（Web「API Key 管理」创建的 `kb-...` 密钥，或登录返回的 JWT）。脚本只用到两个只读接口：

### GET {base}/api/v1/knowledge-bases

拉取可选知识库列表（scope `kb:read`）。脚本读取每项的 `id`、`name`、`document_count`，渲染到选择器；响应外层数组兼容 `items` / `knowledge_bases` / `data` / 裸数组等常见封装。

### POST {base}/api/v1/search

混合检索（scope `kb:search`）。请求体：

```json
{ "query": "题干 + 选项拼接文本", "knowledge_base_ids": ["<kb-uuid>"], "top_k": 5, "rerank": true }
```

- `knowledge_base_ids` 只包含用户在面板中勾选的库；未勾选的库不会被查询
- 响应取 `results[]`，每项映射：`content` → 资料正文，`filename`（+ `page_number`）→ 出处标注，`score` → 相关度

检索失败、鉴权失败或返回空时，脚本静默降级为纯 AI 作答，状态栏提示连接情况（含网关返回的 `detail` 错误描述）。

> 只需为 API Key 勾选 `kb:read` 与 `kb:search` 两个 scope 即可满足脚本答题；`kb:chat` / OpenAI 兼容接口由脚本自身的 AI 配置负责，不经网关。

## 设置面板（知识库答题·API 接入）

| 设置项 | 说明 |
|---|---|
| 启用知识库 | 总开关 |
| 知识库 API 地址 | 网关基址，如 `http://<服务器IP>:8080` |
| 知识库 API Key | Bearer 凭证：`kb-...` API Key 或 JWT |
| 知识库检索片段数 | `top_k`，1-50 |
| 资料字数上限 | 注入提示词的总字数上限 |
| 知识库选择 | 打开选择器：拉取 `/api/v1/knowledge-bases`，勾选库后保存（存于 `aiKbLibs`） |
| 知识库状态 | 只读：未启用 / 未配置地址 / 未选择库 / 已连接·库名 / 连接失败原因 |

## 仓库说明

- `OCS 网课助手.user.js`：产品脚本，直接安装使用；后续修改以 `ai.N` 补丁段形式增量进行
- `legacy/OCS 网课助手.user.js`：旧版基线，仅本地保留（不入 git），用于选择器/逻辑移植对照
