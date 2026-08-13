# nihongo-godan

一个在 Cloudflare Workers 上运行的日语五段动词学习应用，界面参照视觉小说/galgame 风格，左下角有 Live2D 立绘（橘雪莉）实时陪伴讲解。

## 功能

- 循序渐进讲解五段动词的活用（ます形、ない形、て/た形、ば形、可能形、命令形、意志形）
- 交互式练习：选择题、填空题、错题本（可导出 CSV）
- 学习进度保存于浏览器 localStorage
- Live2D 立绘（橘雪莉）根据作答反馈变换表情
- 多文件结构，便于维护与扩展

## 目录结构

```
.
├── wrangler.toml          # Cloudflare Workers 配置
├── src/
│   └── worker.js          # Worker 入口（静态资源托管）
└── public/                # 静态站点
    ├── index.html         # 页面骨架
    ├── css/style.css      # 样式
    ├── js/
    │   ├── conjugator.js  # 日语活用内核
    │   ├── lessons.js     # 课程内容与台词
    │   └── app.js         # 应用逻辑（渲染/练习/错题）
    ├── vendor/            # 第三方库（pixi.js / Live2D runtime）
    └── assets/
        ├── background/    # 背景图
        └── live2d/        # 橘雪莉 Live2D 模型与封装
```

## 本地开发

```bash
npx wrangler dev
```

访问 http://localhost:8787

## 部署

```bash
npx wrangler deploy
```

## 美术资源授权

橘雪莉 Live2D 模型来自 [DevYanxiSama/DesktopPet_TachibanaSherii](https://github.com/DevYanxiSama/DesktopPet_TachibanaSherii)。
该模型**禁止商业使用**，仅限个人学习、研究、非商业用途。详见 `public/assets/live2d/ATTRIBUTION.md`。
