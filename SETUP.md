---
permalink: false
---
# Getting effectivehallucinations.com live

## Step 1 — Create a GitHub repo

1. Go to github.com → click **+** → **New repository**
2. Name it `effective-hallucinations` (or anything you like)
3. Set it to **Public** (required for free Netlify)
4. Don't initialize with a README (you already have files)
5. Click **Create repository**

GitHub will show you a set of commands. Open Terminal and run:

```bash
cd path/to/effective-hallucinations   # the folder you downloaded
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/mlenczner/effective-hallucinations.git
git push -u origin main
```

## Step 2 — Connect to Netlify

1. Go to [netlify.com](https://netlify.com) → **Sign up** (use your GitHub account)
2. Click **Add new site** → **Import an existing project**
3. Choose **GitHub** → authorize → select your `effective-hallucinations` repo
4. Leave all build settings blank (this is a plain HTML site)
5. Click **Deploy site**

## Step 3 — Connect your domain

1. In Netlify: go to **Site configuration** → **Domain management** → **Add a domain**
2. Enter `effectivehallucinations.com` → **Verify**
3. Netlify will give you nameservers
4. Go to wherever you bought the domain → find **Nameservers** or **DNS settings**
5. Replace the existing nameservers with Netlify's
6. Wait 10–30 minutes for DNS to propagate

## Step 4 — Publishing new posts

1. Write your post as a `.md` file in `posts/`
2. Set `draft: false` in the front matter when ready to publish
3. Run:
   ```bash
   git add .
   git commit -m "Add: your post title"
   git push
   ```
4. Netlify auto-deploys in ~30 seconds.
