# ExpressAssistant Web — 重科小助手官方网站

为 Android 校园工具应用「重科小助手（ExpressAssistant）」构建的官方静态网站。

- 域名（规划）：`https://ea.qingfengstudio.cn`
- 归属：Qingfeng Studio
- 技术方案：纯静态 HTML / CSS / JavaScript（ES Module），**无构建步骤、无第三方依赖**

## 本地运行

**直接双击 `index.html` 即可打开**（脚本采用普通 `<script>` 而非 ES Module，`file://` 协议下也可正常渲染）。

也可用任意静态服务器：

```bash
python -m http.server 8080   # 或 npx serve .
```

访问 `http://localhost:8080`。

## 部署（Cloudflare Pages）

1. 将本目录推送到 GitHub 仓库。
2. Cloudflare Pages → 创建项目 → 连接该仓库。
3. 构建命令留空（纯静态），输出目录填 `/`（仓库根目录）。
4. 绑定自定义域名 `ea.qingfengstudio.cn`。

## 目录结构

```
ExpressAssistant-Web/
├── index.html          # 单页官网（全部区块）
├── css/main.css        # 设计变量 + 全部样式（深色科技风）
├── js/
│   ├── data.js         # ★ 站点唯一数据源（版本/下载/日志/公告/功能清单）
│   └── main.js         # 数据渲染 + 交互（导航、滚动渐入、scroll spy）
├── public/
│   ├── images/logo/        # App Logo（待放入）
│   ├── images/screenshots/ # App 真实截图（待放入）
│   ├── images/features/    # 功能配图（待放入）
│   ├── icons/              # favicon 等图标
│   └── files/              # APK 文件（可选，也可用外链）
└── README.md
```

## 如何填充真实素材

| 内容 | 位置 | 状态 |
|---|---|---|
| App Logo | `public/images/logo/logo.png`，页面中以白色圆角徽章承托 | ✅ 已填充 |
| Hero 手机截图 | 主：home.jpg，左：ocr.jpg，右：theme.jpg | ✅ 已填充 |
| 界面展示（7 张） | `js/data.js` → `SHOTS`，文件在 `public/images/screenshots/` | ✅ 已填充 |
| 产品介绍图片 | `decision.jpg`（重科摇摇乐） | ✅ 已填充 |
| 功能卡截图 | `js/data.js` → `FEATURES[].shot`（仍为占位，素材到位后替换） | ⬜ 占位 |
| 最新版本 / APK | `js/data.js` → `DOWNLOAD.latest`（GitHub Releases latest 直链） | ✅ 已配置 |
| 历史版本 | `js/data.js` → `DOWNLOAD.history`（v2.0.12.e / v2.0.12.d） | ✅ 已配置 |
| 更新日志 | `js/data.js` → `CHANGELOG`（来自 GitHub Releases + update.json） | ✅ 已配置 |
| 公告 | App 端 announcement.json 当前为模板占位，官网暂显示「暂无公告」 | ⬜ 等真实公告 |
| GitHub / 联系方式 | `js/data.js` → `LINKS`（GitHub/Gitee/QQ/邮箱，自动渲染） | ✅ 已配置 |
| ICP 备案 | 页脚 `.footer__icp` 占位 | ⬜ 待备案号 |

### 版本数据维护流程

App 发新版本时更新 `js/data.js`：
1. `DOWNLOAD.latest`：新版本号、日期、APK 大小、说明（来自仓库 `update.json` + Release）。
2. 旧版本移入 `DOWNLOAD.history`。
3. `CHANGELOG` 顶部追加新条目。

## 设计规范速览

- 主背景 `#080D18` / 次级 `#101827` / 卡片 `rgba(255,255,255,.05)`
- 强调色 `#648BFF` → `#9275FF` 渐变；标题 `#F5F7FF`；正文 `#A5B0C2`
- 动画只动 `transform` / `opacity`；缓动统一 `cubic-bezier(.4,0,.2,1)` 与 `cubic-bezier(.22,1,.36,1)`
- 已适配 `prefers-reduced-motion`、`:focus-visible`、移动端折叠菜单
