# GitHub Actions 自动部署指南

## 📦 已配置的自动部署

本项目已经配置了 GitHub Actions 工作流，当您将代码推送到 GitHub 时会自动部署到 GitHub Pages。

## 🚀 使用步骤

### 1. 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 创建新仓库（例如：`jikedao-water-station`）
3. 选择 Public（公开）或 Private（私有）
4. **不要**勾选 "Initialize this repository with a README"

### 2. 推送代码到 GitHub

在项目目录运行以下命令：

```bash
# 添加远程仓库
git remote add origin https://github.com/你的用户名/仓库名.git

# 推送代码
git branch -M main
git push -u origin main
```

### 3. 配置 GitHub Pages

推送代码后：

1. 进入 GitHub 仓库页面
2. 点击 **Settings** → **Pages**
3. 在 **Source** 下选择：
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
4. 点击 **Save**

### 4. 等待自动部署

- 推送代码后，GitHub Actions 会自动运行
- 在仓库的 **Actions** 标签页可以查看部署进度
- 部署完成后（约 1-3 分钟），访问：
  ```
  https://你的用户名.github.io/仓库名/
  ```

## 🔄 后续更新

每次修改代码并推送到 GitHub 后，都会自动触发部署：

```bash
git add .
git commit -m "更新说明"
git push
```

## 📋 工作流说明

已配置的工作流文件位于：`.github/workflows/deploy.yml`

工作流会自动执行以下步骤：

1. ✅ 检出代码
2. ✅ 设置 Node.js 环境（版本 18）
3. ✅ 使用 Yarn 安装依赖
4. ✅ 构建项目（`yarn build`）
5. ✅ 将构建后的 `dist` 目录部署到 `gh-pages` 分支
6. ✅ GitHub Pages 自动发布

## ⚙️ 触发条件

工作流会在以下情况自动运行：

- 推送代码到 `main` 分支
- 推送代码到 `master` 分支

## 🔍 查看部署状态

1. 进入 GitHub 仓库
2. 点击顶部的 **Actions** 标签
3. 查看最近的工作流运行记录：
   - ✅ 绿色勾 = 部署成功
   - ❌ 红叉 = 部署失败（点击查看详细错误）
   - 🟡 黄点 = 正在部署中

## 🌐 访问已部署的网站

部署成功后，可以通过以下地址访问：

```
https://你的用户名.github.io/仓库名/
```

例如：
- 用户名：`zhangsan`
- 仓库名：`jikedao-water-station`
- 访问地址：`https://zhangsan.github.io/jikedao-water-station/`

## 🛠️ 自定义域名（可选）

如果想使用自己的域名：

1. 在域名提供商处添加 CNAME 记录：
   ```
   www.yourdomain.com → 你的用户名.github.io
   ```

2. 修改 `.github/workflows/deploy.yml` 文件：
   ```yaml
   - name: Deploy to GitHub Pages
     uses: peaceiris/actions-gh-pages@v3
     with:
       github_token: ${{ secrets.GITHUB_TOKEN }}
       publish_dir: ./dist
       cname: www.yourdomain.com  # 修改这里
   ```

3. 推送更改到 GitHub

## ⚠️ 常见问题

### 问题 1: 页面显示 404

**原因**：GitHub Pages 尚未启用或分支选择错误

**解决**：
1. 进入 Settings → Pages
2. 确保 Source 选择的是 `gh-pages` 分支
3. 等待 1-2 分钟让 GitHub Pages 生效

### 问题 2: 样式或资源加载失败

**原因**：项目路径配置问题

**解决**：`vite.config.js` 中的 `base` 已经配置为 `'./'`，这是正确的配置。

如果仍有问题，可以修改为仓库名：
```js
export default defineConfig({
  base: '/仓库名/',
  // ...
})
```

### 问题 3: Actions 工作流失败

**解决**：
1. 进入 Settings → Actions → General
2. 确保 Workflow permissions 设置为：
   - ✅ Read and write permissions
3. 点击 Actions 标签页，查看错误详情

## 📱 其他部署方式

如果不想使用 GitHub Pages，还可以选择：

- **Vercel**：速度更快，配置更简单（参考 `部署指南.md`）
- **Netlify**：支持拖拽部署（参考 `部署指南.md`）

## 💡 提示

- GitHub Pages 是完全免费的
- 支持自动 HTTPS
- 全球 CDN 加速
- 适合静态网站和前端项目

---

需要帮助？
- GitHub Pages 文档: https://docs.github.com/pages
- GitHub Actions 文档: https://docs.github.com/actions
