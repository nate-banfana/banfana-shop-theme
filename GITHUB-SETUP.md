# Connect this theme to Shopify via GitHub

One-time setup. After this, pushing to the repo updates the live theme automatically — no more zip uploads.

## 1. Clean the broken .git stub (from Windows)
In this folder (`C:\dev\banfana-shop-theme`), delete the `.git` folder. Either:
- File Explorer → show hidden items → delete `.git`, or
- PowerShell: `Remove-Item -Recurse -Force .git`

## 2. Create a GitHub repo
On github.com, create a new **empty** repo, e.g. `banfana-shop-theme` (no README/gitignore — this folder already has them).

## 3. Push (from Windows, in this folder)
```
git init
git add -A
git commit -m "Banfana Shopify theme v2.1.1"
git branch -M main
git remote add origin https://github.com/<you>/banfana-shop-theme.git
git push -u origin main
```

## 4. Connect in Shopify (one-time)
Online Store → Themes → **Add theme → Connect from GitHub** → authorize the Shopify GitHub app → pick the `banfana-shop-theme` repo and the `main` branch.
Shopify creates a theme linked to `main`. **Publish it.**

## From now on
- Theme changes get committed to `main` and **auto-sync** to the store on push.
- Edits made in Shopify's theme editor commit **back** to `main`.
- Roll back anytime via git history. No zip uploads.

Note: GitHub syncs the **theme only**. Products, collections, blog posts, and policies still live in the Shopify admin.
