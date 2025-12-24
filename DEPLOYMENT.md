# Deployment Guide 🚀

## Overview

This guide explains how to deploy the PromptLab website with automatic content updates from the Awesome-Prompt-Engineering repository.

## Architecture

```
┌─────────────────────────────────┐
│ Awesome-Prompt-Engineering Repo │
│  (Content Source)               │
└──────────────┬──────────────────┘
               │
               │ Push to main
               │
               ▼
┌─────────────────────────────────┐
│  GitHub Actions Workflow        │
│  (Optional notification)        │
└──────────────┬──────────────────┘
               │
               │ Triggers update
               │
               ▼
┌─────────────────────────────────┐
│  promptslab.github.io           │
│  (Website)                      │
│  - Fetches latest README.md     │
│  - Parses and displays content  │
│  - Caches for 30 minutes        │
└─────────────────────────────────┘
```

## Step-by-Step Deployment

### 1️⃣ Push Website Files to GitHub

```bash
cd /Users/stoic/Documents/Projects/promptslab.github.io

# Add all new files
git add .

# Commit changes
git commit -m "Add modern website with auto-sync from Awesome-Prompt-Engineering"

# Push to GitHub
git push origin main
```

### 2️⃣ Enable GitHub Pages

1. Go to: https://github.com/promptslab/promptslab.github.io/settings/pages
2. Under **Source**, select: `Deploy from a branch`
3. Under **Branch**, select: `main` and `/root`
4. Click **Save**

GitHub Pages will automatically deploy your site to: **https://promptslab.github.io**

⏱️ First deployment takes 2-5 minutes.

### 3️⃣ Push Workflow to Awesome-Prompt-Engineering (Optional)

This step adds a workflow that notifies when content is updated:

```bash
cd /Users/stoic/Documents/Projects/Awesome-Prompt-Engineering

# Add workflow file
git add .github/workflows/update-website.yml

# Commit
git commit -m "Add workflow to notify website of content updates"

# Push
git push origin main
```

### 4️⃣ Configure GitHub Token (Optional)

For the workflow to trigger website updates, you need a Personal Access Token:

1. Go to: https://github.com/settings/tokens/new
2. Name: `Website Update Token`
3. Expiration: `No expiration` or your preference
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
5. Click **Generate token**
6. Copy the token (you won't see it again!)
7. Go to: https://github.com/promptslab/Awesome-Prompt-Engineering/settings/secrets/actions
8. Click **New repository secret**
9. Name: `WEBSITE_UPDATE_TOKEN`
10. Value: Paste your token
11. Click **Add secret**

**Note**: This step is optional. The website will still auto-update because it fetches content directly from GitHub.

## How Auto-Update Works

### 🔄 Automatic Updates

The website uses **client-side fetching** to get the latest content:

1. When a user visits the site, JavaScript fetches the latest `README.md` from:
   ```
   https://raw.githubusercontent.com/promptslab/Awesome-Prompt-Engineering/main/README.md
   ```

2. Content is cached for **30 minutes** for performance

3. After 30 minutes, the next visitor gets fresh content

4. Users can force refresh (Ctrl+F5 or Cmd+Shift+R) to see immediate updates

### ⚡ Instant Updates

To see changes immediately without waiting for cache:

- **Hard Refresh**: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
- **Clear Cache**: Developer Tools → Application → Clear Storage
- **Incognito Mode**: Open site in private/incognito window

## Testing Locally

```bash
# Navigate to website directory
cd /Users/stoic/Documents/Projects/promptslab.github.io

# Start local server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

## Verify Deployment

After deploying, verify these URLs work:

- ✅ Homepage: https://promptslab.github.io
- ✅ About Page: https://promptslab.github.io/about.html
- ✅ Search functionality works
- ✅ Category filters work
- ✅ Content loads from Awesome-Prompt-Engineering repo

## Troubleshooting

### Issue: Website shows old content

**Solution**: 
- Clear browser cache
- Wait up to 30 minutes for cache to expire
- Hard refresh the page

### Issue: Content not loading

**Solution**:
- Check browser console for errors
- Verify GitHub repo is public
- Check if README.md exists at: https://raw.githubusercontent.com/promptslab/Awesome-Prompt-Engineering/main/README.md

### Issue: GitHub Pages not deploying

**Solution**:
- Check GitHub Actions tab for build errors
- Ensure `main` branch has the latest files
- Verify GitHub Pages is enabled in settings

### Issue: Search not working

**Solution**:
- Check browser console for JavaScript errors
- Ensure `app.js` is loaded correctly
- Try hard refresh

## Maintenance

### Updating Website Design

```bash
# Make changes to HTML/CSS/JS files
# Test locally
python3 -m http.server 8000

# Commit and push
git add .
git commit -m "Update website design"
git push origin main

# GitHub Pages auto-deploys in 2-5 minutes
```

### Updating Content

Just update the `README.md` in the **Awesome-Prompt-Engineering** repository:

```bash
cd /Users/stoic/Documents/Projects/Awesome-Prompt-Engineering

# Edit README.md
# Add new resources, fix typos, etc.

git add README.md
git commit -m "Add new prompt engineering resources"
git push origin main

# Website automatically fetches new content!
```

## Performance Optimization

Current optimizations:

- ✅ **Client-side caching** (30 minutes)
- ✅ **Minimal dependencies** (no frameworks)
- ✅ **Lazy loading** (content loads on demand)
- ✅ **Optimized CSS** (single file, minified in production)

## Security

- ✅ All external links open in new tabs (`target="_blank"`)
- ✅ `rel="noopener noreferrer"` for security
- ✅ No sensitive data stored
- ✅ No backend required
- ✅ No database required

## Future Enhancements

Consider adding:

- 🌙 Light/Dark mode toggle
- 📊 Analytics (Google Analytics or Plausible)
- 🔖 Bookmark/favorite resources
- 📱 PWA (Progressive Web App) support
- 🌍 i18n (Internationalization)
- 📈 Trending/Popular section

## Support

- 📚 [Documentation](https://github.com/promptslab/promptslab.github.io)
- 💬 [Discord Community](https://discord.gg/m88xfYMbK6)
- 🐛 [Report Issues](https://github.com/promptslab/promptslab.github.io/issues)

---

**🎉 Your website is ready to deploy! Just push the changes and enable GitHub Pages.**
