# OCS 网课助手（模块化重构）

单文件油猴脚本的低耦合重构版。构建产物仍是一个 `.user.js`，源码按分层架构组织。

## 目录结构

```
legacy/            旧版单文件 bundle（回归基线，勿改）
src/
  shell/           入口层：metadata.ts（生成 userscript 头）+ bootstrap.ts（装配依赖）
  core/            领域核心：零 GM、零平台依赖，可单测
    ports.ts       端口接口：StoragePort / HttpPort / SecretPort / CacheStorePort / LoggerPort / NotifyPort
    types.ts       领域类型：QuestionContext / AnswerResult / AnswererPort
    events.ts      事件总线
    matcher/       答案归一化与匹配（纯函数，已迁移 + 有测试）
    cache/         内存缓存 + 分层缓存策略
  ai/              AI 答题模块（只依赖 ports）
    client.ts      请求状态机（待迁移）
    config.ts      Provider 注册表 + AIConfig
    prompt.ts      提示词构建与解析
    rag/           本地知识库检索（待迁移）
  adapters/        端口实现，唯一允许触碰 GM_* 的地方
    gm-storage.ts  gm-http.ts  gm-secrets.ts  idb-cache.ts  gm-misc.ts
  platforms/       每平台一个目录，实现统一 Platform 接口
    chaoxing/ zhihuishu/ icve/ icourse163/ yuketang/
  ui/              悬浮窗/面板，只通过 EventBus 与 core 通信
```

## 依赖规则

- `core`、`ai` 不得 import `adapters`、`platforms`、`ui`，也不得直接使用 `GM_*`。
- `platforms` 通过构造注入的 `PlatformDeps`（即 `CorePorts`）访问一切外部能力。
- `ui` 只订阅/发布 `EventBus` 事件。
- `@connect` 白名单在构建期由 `AI_PROVIDERS` 注册表自动生成（见 `shell/metadata.ts`），
  自定义 provider 需用户自行在脚本管理器中追加。

## 常用命令

```bash
npm install
npm run typecheck   # 类型检查
npm test            # vitest 单元测试
npm run build       # 产出 dist/OCS 网课助手.user.js
```

## 迁移进度

- [x] 仓库骨架 + 端口定义 + 构建管线
- [x] core/matcher 纯函数迁移（含测试）
- [ ] ai/client 请求状态机（重试/参数降级/JSON 修复）
- [ ] ai/rag 本地知识库
- [ ] 各平台适配器逐个迁移（每迁一个跑真实页面回归，对照 legacy bundle）
- [ ] ui 面板迁移，删除 legacy
