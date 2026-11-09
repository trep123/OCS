# OCS 网课助手（thin-client + local-server 架构）

油猴脚本只做三件事：**抓题目和选项 → 发给本地 server → 把答案填回页面**。
所有决策（AI 调用、知识库检索、会话记录复用）都在本地 server 完成，API Key 只存在于 server 环境变量，不进浏览器。

```
┌────────────────────────┐   POST /api/answer    ┌──────────────────────────────┐
│ 油猴脚本（薄客户端）      │ ────────────────────► │ 本地 server 127.0.0.1:19818   │
│  platforms/ 抓题+填答案  │ ◄──────────────────── │  session/ 会话记录命中 → 直接返回 │
│  transport/ GM_xhr      │      AnswerResponse   │  kb/     知识库检索 → 注入提示词 │
│  @connect 仅 127.0.0.1  │                       │  ai/     OpenAI 兼容接口 + 重试  │
└────────────────────────┘                       └──────────────────────────────┘
```

## 目录结构

```
legacy/                 旧版单文件 bundle（回归基线，勿改）
src/
  shared/               两端共用
    protocol.ts         HTTP 协议 DTO：AnswerRequest/AnswerResponse/FeedbackRequest
    matcher/            答案归一化与匹配（纯函数，已迁移 + 有测试）
  userscript/           油猴薄客户端
    shell/              metadata.ts（生成 userscript 头）+ bootstrap.ts（装配）
    transport/          server-client.ts：GM_xmlhttpRequest → 本地 server
    platforms/          每平台一个目录：observeQuestions（抓题）+ writeAnswer（填答案）
    ui/                 状态悬浮条
  server/               本地决策服务（node:http，零运行时依赖）
    config.ts           环境变量配置
    ai/                 OpenAI 兼容客户端（重试/退避）+ 提示词构建 + JSON 解析
    kb/                 知识库：data/kb/*.txt|md，bigram 关键词检索
    session/            会话记录：data/sessions/*.jsonl，命中直接返回 + feedback 记录
    index.ts            HTTP 路由：/health /api/answer /api/feedback
data/                   运行时数据（gitignored）
  kb/                   放知识库文档（.txt / .md，空行分段）
  sessions/             会话记录 JSONL（自动生成）
```

## 决策优先级（server 端）

1. **会话记录**：同平台同题干曾答过 → 直接返回（source: `session`）
2. **知识库 + AI**：KB 检索相关段落注入提示词 → AI 作答 → 记录进会话
3. 客户端可通过 `/api/feedback` 上报对错，写入 `feedback.jsonl` 供后续调优

## 使用

```bash
npm install

# 启动本地 server（配置 AI）
OCS_AI_KEY=sk-xxx npm run dev:server
# 可选环境变量：OCS_PORT / OCS_AI_BASE / OCS_AI_MODEL / OCS_AI_TIMEOUT / OCS_DATA_DIR

npm run build          # 产出 dist/OCS 网课助手.user.js + dist/server/index.mjs
npm run typecheck && npm test
```

安装 `dist/OCS 网课助手.user.js` 到油猴/脚本猫即可。脚本默认连 `http://127.0.0.1:19818`，
可在脚本管理器存储中设置 `ocs.server` 覆盖。

## 安全边界

- 油猴脚本 `@connect` 仅 `127.0.0.1` / `localhost`，`@grant` 仅 4 项，无密钥存储
- server 仅监听回环地址；请求体上限 2MB；AI 错误信息不回传密钥

## 迁移进度

- [x] 协议定义 + 双端骨架 + 构建管线
- [x] shared/matcher 纯函数（含测试）
- [x] server：AI 客户端 / KB 检索 / 会话记录 / HTTP 路由（可运行）
- [ ] platforms：各平台抓题与答案写回（从 legacy bundle 逐个迁移，每迁一个跑真实页面回归）
- [ ] 客户端 UI：悬浮面板、设置、手动反馈入口
- [ ] server：RAG 向量化检索、feedback 驱动的会话记录纠错
