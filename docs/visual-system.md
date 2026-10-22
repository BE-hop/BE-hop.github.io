# 视觉与交互规范

## 当前优先级

2026-10-23：展示速度、可读性和原生操作优先。保留视觉身份，装饰保持静态。
首页SVG隧道、深石墨到森林绿/暖白过渡、双语真实文字、四个Hero入口继续使用。
首页低透明度照片层默认隐藏以减少首屏请求，原数据字段和母版保留。
取消自动下移、视差、Scroll Stack定位与默认拟真翻页；高清图只在主动查看或开启放大镜后加载。
标题、正文和关键入口默认可见，不能以CSS或JS初始化为条件。键盘、触屏、减少动态和390px布局均须检查。

## 排版与主题

- 正文和导航使用本地Manrope，Works标题Playfair Display，AI标题Space Grotesk；font-display:swap。
- Works为暖白与森林绿，AI为石墨与冰青，保持单页强调色克制。
- 品牌正面文字保持可访问，深度装饰使用伪元素，不重复可朗读DOM文字。
- 作品集三册保留书脊、纸页前口、封面色彩及明确双行标题；阅读器固定2:1，图面不裁切或重新配对。
- 展板沿用portfolio-page-*.jpg命名，横竖按原始比例跨栏显示；源媒体保留。
- 旧动效实现和历史参照见history/agents-before-fluency.md，不能据此恢复已退役交互。

## 页面职责

index.html提供语义钩子，portfolio.css/portfolio.js负责首页与Works专属行为；showcase-system负责共享外观及导航色调。
portfolio-books负责按需阅读及立即翻页，高清查看器独立按点击加载。图片用途与预算见loading-performance.md。
