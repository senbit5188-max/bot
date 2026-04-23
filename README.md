# AGX · Ascenda Digital Capital Group

响应式 PC + 移动端官网重构版本。

## 结构

```
.
├── index.html           # 首页（Hero / 地球 / 关于 / 业务 / 节点 / 团队 / 安全 / 技术 / 资质）
├── agreement.html       # 用户协议
├── privacy.html         # 隐私政策
├── disclaimer.html      # 免责声明
├── risk.html            # 风险提示
└── assets/
    ├── styles.css       # 主站响应式样式（移动优先）
    ├── legal.css        # 法务 / 协议子页共享样式
    ├── app.js           # 导航、抽屉菜单、滚动揭示、地球动画、城市弹窗
    └── img/             # 图片资源（globe / 团队头像 / 监管牌照）
```

## 本地预览

纯静态站点，任意静态服务器都可：

```bash
python3 -m http.server 8000
# 访问 http://localhost:8000/
```

## 响应式断点

- **< 360px** — 迷你手机（单列、紧凑间距）
- **≥ 640px (sm)** — 常规手机、小平板
- **≥ 768px (md)** — 平板
- **≥ 1024px (lg)** — 桌面（展开 nav，Globe 双栏，About 双栏）
- **≥ 1280px (xl)** — 大桌面（团队/产品 6 列，容器最大 1200px 居中）

关键响应式特性：

- `clamp()` 流式排版，360–1920px 视窗内无断点跳变
- CSS Grid + Flexbox 混合布局，图片 `loading="lazy"` + `decoding="async"`
- `prefers-reduced-motion` 降级动画
- `dvh` 单位适配移动端浏览器地址栏
- 语义化 `header` / `main` / `section` / `footer` / `nav` landmark
- 触控目标最小 48×48px，抽屉菜单、CTA 按钮均满足

## 无第三方运行时依赖

主站 JS 是纯原生（无 GSAP/jQuery），使用 `IntersectionObserver` 做滚动揭示，保持首屏加载轻量。
