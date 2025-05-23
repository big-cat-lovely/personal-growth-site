# 个人成长网站使用说明

## 项目简介

这是一个个人成长网站，旨在帮助用户记录个人感悟、追踪健康状况、收藏有用链接、设定并管理个人目标以及处理待办事项。所有数据均存储在用户的本地浏览器 LocalStorage 中，支持多用户在同一浏览器上分别使用。

## 主要功能

1.  **用户认证**：
    *   支持多用户通过用户名和密码注册及登录。
    *   每个用户的数据独立存储，互不干扰。
2.  **个人感悟记录**：
    *   支持富文本编辑，可以进行图文混排和基本格式化（如标题、加粗、列表）。
    *   支持从本地文本文件（.txt, .md, .html）上传内容到编辑器。
    *   可以创建、查看、编辑和删除个人感悟。
3.  **健康打卡**：
    *   通过日历视图选择日期进行打卡。
    *   记录每日运动项目、时长，以及饮食内容和摄入热量。
    *   查看、编辑和删除已有的健康日志。
    *   （未来可扩展）健康数据统计图表展示（当前为占位符）。
4.  **收藏空间**：
    *   添加和管理有用的网页链接。
    *   记录链接的标题、URL、备注信息。
    *   支持为链接添加自定义标签，并按标签筛选查看。
5.  **目标设定与追踪**：
    *   设定短期或长期目标，并可选择目标日期。
    *   通过进度条追踪目标完成百分比。
    *   更新目标状态（待办、进行中、已完成）。
6.  **待办事项列表 (Todo List)**：
    *   快速添加、编辑和删除待办任务。
    *   标记任务为已完成或未完成。

## 如何运行项目（供开发者参考）

如果您希望在本地进行二次开发或查看源代码，请按以下步骤操作：

1.  **环境要求**：
    *   Node.js (推荐最新 LTS 版本)
    *   pnpm (或 npm/yarn)

2.  **安装依赖**：
    *   解压 `personal_growth_site_deliverable.zip` 文件。
    *   在项目根目录 (`personal_growth_site`) 下打开终端，运行以下命令安装项目依赖：
        ```bash
        pnpm install
        ```

3.  **启动开发服务器**：
    *   安装完依赖后，运行以下命令启动本地开发服务器：
        ```bash
        pnpm run dev
        ```
    *   开发服务器通常会运行在 `http://localhost:5173`。

4.  **生产构建**：
    *   如需生成生产环境的静态文件，运行：
        ```bash
        pnpm run build
        ```
    *   构建产物会生成在 `dist` 文件夹内。

## 如何使用已构建的网站

压缩包内的 `personal_growth_site_deliverable.zip` 中包含一个 `dist` 文件夹。这个 `dist` 文件夹包含了网站的所有静态文件，可以直接部署到任何支持静态网站托管的服务器或平台（例如 GitHub Pages, Netlify, Vercel, 或您自己的 Web 服务器如 Nginx, Apache）。

**直接在本地浏览器中打开**：

您也可以直接在本地浏览器中打开 `dist` 文件夹内的 `index.html` 文件来使用本网站。但请注意，由于浏览器安全策略的限制（特别是对于 `file:///` 协议下的某些 JavaScript API），部分功能（尤其是路由或 LocalStorage 的某些复杂交互）可能无法完美运行。**推荐将 `dist` 目录下的文件部署到一个简单的本地 HTTP 服务器上进行访问，以获得最佳体验。**

例如，如果您安装了 Node.js，可以使用 `serve` 包快速启动一个本地服务器：

1.  全局安装 `serve` (如果尚未安装):
    ```bash
    npm install -g serve
    ```
2.  进入 `dist` 文件夹:
    ```bash
    cd path/to/personal_growth_site/dist
    ```
3.  启动服务器:
    ```bash
    serve -s
    ```
    然后根据终端提示的地址（通常是 `http://localhost:3000`）在浏览器中访问。

## 数据存储

*   所有用户数据（包括账户信息、感悟、健康记录、书签、目标和待办事项）都存储在您当前使用的浏览器的 LocalStorage 中。
*   **重要提示**：
    *   清除浏览器缓存或 LocalStorage 数据会导致所有已保存信息丢失。
    *   数据不会在不同浏览器或不同设备之间同步。
    *   建议定期自行备份重要数据（可以通过开发者工具查看 LocalStorage 内容并复制）。

## 界面风格

网站采用清新、卡片式的布局设计，力求简洁美观、易于使用。

感谢您的使用！如果您有任何问题或建议，请随时提出。

