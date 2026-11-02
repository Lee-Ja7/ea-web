/* =========================================================
   data.js — 站点唯一数据源（普通 script，挂载到 window.DATA）
   ---------------------------------------------------------
   版本数据来源：GitHub Releases + 仓库 update.json
   https://github.com/Lee-Ja7/ExpressAssistant_ii
   注意：为支持 file:// 直接双击打开，不使用 ES Module，
   整体包在 IIFE 内，避免顶层 const 污染全局作用域。
   ========================================================= */

(() => {

const SITE = {
  name: "重科小助手",
  nameEn: "ExpressAssistant",
  studio: "Qingfeng Studio",
  domain: "ea.qingfengstudio.cn",
};

/* ---------- 项目链接 ---------- */
const LINKS = {
  github: "https://github.com/Lee-Ja7/ExpressAssistant_ii",
  gitee: "https://gitee.com/qingfeng_studio/ExpressAssistant_ii",
  qq: "1056931142",
  email: "lyqingfeng@163.com",
};

/* ---------- 下载配置 ---------- */
const DOWNLOAD = {
  latest: {
    version: "v2.0.13.a",
    versionCode: 59,
    date: "2026-10-29",
    apkSize: "72.9 MB",
    minAndroid: "Android 8.0",
    arch: "arm64-v8a",
    apkUrl: "https://github.com/Lee-Ja7/ExpressAssistant_ii/releases/latest/download/app-release.apk",
    notes: "简化应用更新流程：检查版本后自动下载，校验 APK 完整性后调用系统安装器；保留 Gitee 主源与 GitHub 回退机制。",
  },
  history: [
    {
      version: "v2.0.12.e",
      date: "2026-10-28",
      apkUrl: "https://github.com/Lee-Ja7/ExpressAssistant_ii/releases/download/v2.0.12.e/app-release.apk",
      notes: "更新公告功能",
    },
    {
      version: "v2.0.12.d",
      date: "2026-10-27",
      apkUrl: "https://github.com/Lee-Ja7/ExpressAssistant_ii/releases/download/v2.0.12.d/app-release.apk",
      notes: "本次发布了新的功能",
    },
  ],
};

/* ---------- 更新日志 ----------
 * 数据来自 GitHub Releases 与 update.json。
 * type: "major" | "minor" | "patch"；status: "released"
 */
const CHANGELOG = [
  {
    version: "v2.0.13.a",
    date: "2026-10-29",
    type: "major",
    status: "released",
    items: [
      "正式版第一版发布。",
      "简化应用更新流程：检查版本后自动下载，校验 APK 完整性后调用系统安装器。",
      "保留 Gitee 主源与 GitHub 回退机制（双源策略）。",
    ],
  },
  {
    version: "v2.0.12.e",
    date: "2026-10-28",
    type: "minor",
    status: "released",
    items: ["更新公告功能。"],
  },
  {
    version: "v2.0.12.d",
    date: "2026-10-27",
    type: "minor",
    status: "released",
    items: ["本次发布了新的功能。"],
  },
];

/* ---------- 公告 ----------
 * App 端公告数据（Release 附件 announcement.json）当前为模板占位内容，
 * 因此官网暂不展示具体公告；发布真实公告后在此追加。
 * 结构：{ title, date, category, excerpt, url }
 */
const ANNOUNCEMENTS = [];

/* ---------- 功能清单 ----------
 * img: 功能截图（public/images/features/ 下），无素材时保持 null 显示占位
 */
const FEATURES = [
  { icon: "calendar",   name: "课程表",     desc: "课程安排与日常课表管理。",   img: "timetable.jpg" },
  { icon: "package",    name: "取件码识别", desc: "OCR 识别与取件码定位。",     img: "pickup.jpg" },
  { icon: "map-pin",    name: "校园地图",   desc: "校园地图与地点信息。",       img: "map.jpg" },
  { icon: "search",     name: "地图速览",   desc: "快速查看校园相关信息。",     img: "map-overview.jpg" },
  { icon: "mountain",   name: "海拔工具",   desc: "提供海拔信息查询。",         img: "altitude.jpg" },
  { icon: "music",      name: "音乐功能",   desc: "提供音乐相关体验。",         img: "music.jpg" },
  { icon: "wrench",     name: "实用工具箱", desc: "整合多种日常工具。",         img: "toolbox.jpg" },
  { icon: "link",       name: "常用链接",   desc: "快速访问常用校园服务。",     img: "links.jpg" },
];

/* ---------- App 界面截图（真实素材） ---------- */
const SHOTS = [
  { file: "home.jpg",     name: "首页" },
  { file: "express.jpg",  name: "快递助手" },
  { file: "tools.jpg",    name: "工具箱" },
  { file: "decision.jpg", name: "重科摇摇乐" },
  { file: "altitude.jpg", name: "海拔仪" },
  { file: "ocr.jpg",      name: "OCR 助手" },
  { file: "theme.jpg",    name: "界面风格" },
];

/* 挂载到全局，供 main.js 使用（file:// 可双击打开） */
window.DATA = { SITE, LINKS, DOWNLOAD, CHANGELOG, ANNOUNCEMENTS, FEATURES, SHOTS };

})();
