/* =========================================================
   main.js — 入口：渲染数据 + 交互行为
   （普通 script，依赖 window.DATA，由 data.js 先行加载）
   ========================================================= */
const { SITE, LINKS, DOWNLOAD, CHANGELOG, ANNOUNCEMENTS, FEATURES, SHOTS } = window.DATA;

const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmt = (v, fallback = "待填写") => (v == null || v === "" ? fallback : esc(v));

/* ---------- 内联 SVG 线性图标库（去 emoji / 去 AI 化） ---------- */
const ICONS = {
  calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/>',
  package: '<path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05"/><path d="M12 22.08V12"/>',
  'map-pin': '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
  mountain: '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
  sparkles: '<path d="M12 2 14.5 9.5 22 12 14.5 14.5 12 22 9.5 14.5 2 12 9.5 9.5z"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-3-6.71"/><path d="M21 3v5h-5"/>',
  smartphone: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
  'git-branch': '<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
  message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
};
function icon(name) {
  const body = ICONS[name] || "";
  return `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}
/* 扫描 [data-icon]，把 emoji/占位内容替换为 SVG */
function initIcons() {
  document.querySelectorAll("[data-icon]").forEach((el) => {
    el.innerHTML = icon(el.dataset.icon);
  });
}

/* ---------- 功能网格渲染 ---------- */
function renderFeatures() {
  const grid = $("#featureGrid");
  if (!grid) return;
  grid.innerHTML = FEATURES.map((f, i) => `
    <article class="card feature-card reveal" style="--reveal-delay:${Math.min(i * 50, 350)}ms">
      <span class="feature-card__ico" aria-hidden="true">${icon(f.icon)}</span>
      <h3>${esc(f.name)}</h3>
      <p>${esc(f.desc)}</p>
      ${f.img
        ? `<img class="feature-shot" src="public/images/features/${esc(f.img)}" alt="${esc(f.name)}功能截图" loading="lazy" />`
        : `<div class="ph ph--shot" style="--ph-ratio:9/16" data-ph-name="${esc(f.shot || f.name + "截图")}">截图占位</div>`}
    </article>`).join("");
}

/* ---------- 界面截图渲染（无缝滚动轮播：渲染两份实现循环） ---------- */
function renderShots() {
  const el = $("#shotsTrack");
  if (!el) return;
  const item = (s) => `
    <div class="shot" role="listitem">
      <img src="public/images/screenshots/${esc(s.file)}" alt="${esc(s.name)}界面截图" loading="lazy" />
      <p>${esc(s.name)}</p>
    </div>`;
  el.innerHTML = SHOTS.map(item).join("") + SHOTS.map(item).join("");
}

/* ---------- 轮播暂停：页面隐藏 / 减少动效时暂停 ---------- */
function initShotsAutoplay() {
  const track = $("#shotsTrack");
  if (!track) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) { track.classList.add("is-paused"); return; }
  const onVis = () => {
    if (document.hidden) track.classList.add("is-paused");
    else track.classList.remove("is-paused");
  };
  document.addEventListener("visibilitychange", onVis);
}

/* ---------- 链接与反馈渲染 ---------- */
function renderLinks() {
  const el = $("#linkList");
  if (!el) return;
  const items = [
    { label: "GitHub 仓库", href: LINKS.github, icon: "github" },
    { label: "Gitee 镜像", href: LINKS.gitee, icon: "git-branch" },
    { label: `QQ：${LINKS.qq}`, href: `https://wpa.qq.com/msgrd?v=3&site=qq&menu=yes&uin=${LINKS.qq}`, icon: "message" },
    { label: `反馈邮箱：${LINKS.email}`, href: `mailto:${LINKS.email}`, icon: "mail" },
  ];
  el.innerHTML = items.map((it) => `
    <li>
      <a class="link-item" href="${esc(it.href)}" ${it.href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>
        <span class="link-item__ico" aria-hidden="true">${icon(it.icon)}</span>${esc(it.label)}<span class="link-arrow" aria-hidden="true">→</span>
      </a>
    </li>`).join("");
}

/* ---------- 下载中心渲染 ---------- */
function renderDownload() {
  const meta = $("#dlMeta");
  const latest = DOWNLOAD.latest;

  if (meta) {
    meta.innerHTML = `
      <div><dt>平台</dt><dd>Android</dd></div>
      <div><dt>最新版本</dt><dd>${fmt(latest.version, "待发布")}</dd></div>
      <div><dt>更新日期</dt><dd>${fmt(latest.date)}</dd></div>
      <div><dt>APK 大小</dt><dd>${fmt(latest.apkSize)}</dd></div>
      <div><dt>最低 Android 版本</dt><dd>${fmt(latest.minAndroid)}</dd></div>
      <div><dt>架构</dt><dd>${fmt(latest.arch)}</dd></div>`;
  }

  // 下载按钮：有真实地址才启用
  document.querySelectorAll(".js-download-apk").forEach((a) => {
    if (latest.apkUrl) {
      a.setAttribute("href", latest.apkUrl);
      a.removeAttribute("aria-disabled");
      const note = $("#downloadNote");
      if (note) note.textContent = "直连 GitHub Releases 下载；如速度较慢，可前往 Gitee 镜像 Releases 下载。";
    }
  });

  // 历史版本列表
  const list = $("#versionList");
  if (list) {
    if (!DOWNLOAD.history.length) {
      list.innerHTML = `
        <div class="version-row">
          <strong>历史版本</strong>
          <span class="tag tag--planned">暂无历史版本数据（占位）</span>
          <span class="spacer"></span>
          <span style="color:var(--text-b)">发布后在 js/data.js 的 DOWNLOAD.history 中维护</span>
        </div>`;
    } else {
      list.innerHTML = DOWNLOAD.history.map((v) => `
        <div class="version-row">
          <strong>${esc(v.version)}</strong>
          <span>${fmt(v.date)}</span>
          <span class="spacer"></span>
          ${v.apkUrl
            ? `<a class="btn btn--ghost btn--sm" href="${esc(v.apkUrl)}">下载</a>`
            : `<span class="ph ph--chip" data-ph-name="下载地址">地址待配置</span>`}
        </div>`).join("");
    }
  }
}

/* ---------- 更新日志渲染 ---------- */
function renderChangelog() {
  const list = $("#changelogList");
  if (!list) return;
  const typeLabel = { major: "大版本", minor: "功能更新", patch: "修复更新" };
  list.innerHTML = CHANGELOG.map((v) => `
    <article class="log-item ${v.status === "planned" ? "log-item--planned" : ""}">
      <header class="log-head">
        <h3>${esc(v.version)}</h3>
        <span class="log-date">${esc(v.date)}</span>
        <span class="tag ${v.type === "major" ? "tag--major" : ""}">${typeLabel[v.type] || "更新"}</span>
        ${v.status === "planned" ? `<span class="tag tag--planned">示例占位</span>` : `<span class="tag">已发布</span>`}
      </header>
      <div class="log-body"><ul>${v.items.map((it) => `<li>${esc(it)}</li>`).join("")}</ul></div>
    </article>`).join("");
}

/* ---------- 公告渲染 ---------- */
function renderAnnouncements() {
  const list = $("#announcementList");
  if (!list) return;
  if (!ANNOUNCEMENTS.length) {
    list.innerHTML = `<div class="ann-empty">${icon("bell")}<span>暂无公告</span><br /><small style="font-size:13px">公告发布后在 js/data.js 的 ANNOUNCEMENTS 中维护。</small></div>`;
    return;
  }
  list.innerHTML = ANNOUNCEMENTS.map((a) => `
    <article class="card ann-item">
      <div class="ann-item__head">
        <h3>${esc(a.title)}</h3>
        <span class="tag">${esc(a.category)}</span>
        <time class="log-date">${esc(a.date)}</time>
      </div>
      <p>${esc(a.excerpt)}</p>
      ${a.url ? `<a href="${esc(a.url)}">查看详情 →</a>` : ""}
    </article>`).join("");
}

/* ---------- Hero 版本号 ---------- */
function renderHeroVersion() {
  document.querySelectorAll(".js-app-version").forEach((el) => {
    el.textContent = DOWNLOAD.latest.version || "待发布";
  });
}

/* ---------- 占位组件：从 data-ph-* 注入名称与比例 ---------- */
function initPlaceholders() {
  document.querySelectorAll(".ph").forEach((el) => {
    const name = el.dataset.phName;
    const ratio = el.dataset.phRatio;
    if (name) el.setAttribute("aria-label", `占位区域：${name}`);
    if (ratio) el.style.setProperty("--ph-ratio", ratio.replace("/", " / "));
  });
}

/* ---------- 背景文字水印（品牌名，斜排平铺） ---------- */
function initWatermark() {
  const el = document.querySelector(".bg-watermark");
  if (!el) return;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="430" height="200" viewBox="0 0 430 200">` +
    `<text x="215" y="105" text-anchor="middle" font-size="46" font-weight="700" fill="#FFFFFF" font-family="'PingFang SC','Microsoft YaHei',sans-serif">重科小助手</text>` +
    `<text x="215" y="140" text-anchor="middle" font-size="15" font-weight="600" letter-spacing="7" fill="#FFFFFF" font-family="Arial,sans-serif">EXPRESSASSISTANT</text>` +
    `</svg>`;
  el.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/* ---------- 导航：吸顶状态 ---------- */
function initNavbar() {
  const navbar = $("#navbar");
  const onScroll = () => navbar.classList.toggle("is-scrolled", window.scrollY > 24);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------- 导航：移动端折叠菜单 ---------- */
function initMobileMenu() {
  const toggle = $("#navToggle");
  const menu = $("#navMenu");
  if (!toggle || !menu) return;

  const close = () => {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "打开菜单");
  };
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
  });
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
}

/* ---------- 导航：当前区块高亮（scroll spy） ---------- */
function initScrollSpy() {
  const links = [...document.querySelectorAll(".nav-link")];
  const map = new Map();
  links.forEach((l) => {
    const sec = document.querySelector(l.getAttribute("href"));
    if (sec) map.set(sec, l);
  });
  if (!map.size) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        links.forEach((l) => l.classList.remove("is-active"));
        map.get(en.target)?.classList.add("is-active");
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  map.forEach((_, sec) => observer.observe(sec));
}

/* ---------- 滚动渐入（IntersectionObserver + stagger） ---------- */
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    els.forEach((el) => el.classList.add("is-in"));
    return;
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("is-in");
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  els.forEach((el) => observer.observe(el));
}

/* ---------- 启动 ---------- */
renderFeatures();
renderShots();
initShotsAutoplay();
renderLinks();
renderDownload();
renderChangelog();
renderAnnouncements();
renderHeroVersion();
initPlaceholders();
initIcons();
initWatermark();
initNavbar();
initMobileMenu();
initScrollSpy();
initReveal();
