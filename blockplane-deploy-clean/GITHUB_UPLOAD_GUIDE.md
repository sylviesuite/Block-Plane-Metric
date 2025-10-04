# GitHub Upload Guide: BlockPlane Metric v2.8

This guide will help you upload the updated BlockPlane Metric calculator to your GitHub repository.

## Option 1: Upload via GitHub Web Interface (Recommended for Quick Updates)

### Step 1: Navigate to Your Repository

1. Go to [https://github.com/sylviesuite/Block-Plane-Metric](https://github.com/sylviesuite/Block-Plane-Metric)
2. Log in if you haven't already

### Step 2: Extract the Package

1. Download the `BlockPlane-Metric-GitHub-Ready.zip` file
2. Extract it to a location on your computer
3. Navigate into the extracted folder: `blockplane-repo`
4. You should see these folders and files:
   - `public/` folder
   - `src/` folder
   - `backend/` folder
   - `node_modules/` folder
   - `netlify.toml`
   - `DEPLOYMENT.md`
   - `RELEASE_NOTES.md`
   - `README.md`
   - `package.json`
   - `tsconfig.json`

### Step 3: Upload New Files

**Upload the new files:**

1. In your GitHub repository, click **"Add file"** → **"Upload files"**
2. Drag and drop these new files/folders:
   - `public/` folder (contains the calculator)
   - `netlify.toml`
   - `DEPLOYMENT.md`
   - `RELEASE_NOTES.md`
3. Scroll down and click **"Commit changes"**

**Update the README:**

1. Click on `README.md` in your repository
2. Click the pencil icon (Edit this file)
3. Scroll to the bottom and add the deployment section from the new README
4. Click **"Commit changes"**

### Step 4: Verify the Upload

After uploading, your repository should have this structure:

```
Block-Plane-Metric/
├── public/
│   ├── index.html
│   └── metric/
│       └── index.html
├── src/
├── backend/
├── netlify.toml
├── DEPLOYMENT.md
├── RELEASE_NOTES.md
└── README.md
```

## Option 2: Upload via Git Command Line (For Advanced Users)

If you prefer using Git commands:

```bash
# Navigate to the extracted repository
cd /path/to/blockplane-repo

# Initialize git if needed (skip if already initialized)
git init

# Add the remote (skip if already added)
git remote add origin https://github.com/sylviesuite/Block-Plane-Metric.git

# Stage all changes
git add .

# Commit the changes
git commit -m "Add BlockPlane Metric v2.8 with all fixes"

# Push to GitHub
git push origin main
```

## What's Included in This Update

This update includes:

✅ **Calculator with All Fixes:**
- Dark mode as default
- Gold branding (#FFD700)
- Regenerative Impact Score terminology
- Project Pass pricing at $199
- CPI value hiding
- Paris badge gating

✅ **Deployment Configuration:**
- Netlify configuration file
- Landing page
- Proper routing setup

✅ **Documentation:**
- Deployment guide
- Release notes
- Updated README

## Next Steps: Deploy to Netlify

Once uploaded to GitHub:

1. Log in to [Netlify](https://www.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **GitHub** and authorize access
4. Choose the `Block-Plane-Metric` repository
5. Netlify will auto-detect the configuration
6. Click **"Deploy site"**

Your calculator will be live at `https://your-site.netlify.app/metric` in less than a minute!

## Troubleshooting

**Issue:** Files uploaded to wrong location
- **Solution:** Make sure you're uploading the contents of the `blockplane-repo` folder, not the folder itself

**Issue:** Calculator not loading at `/metric`
- **Solution:** Verify that `netlify.toml` was uploaded to the root of your repository

**Issue:** Dark mode not default
- **Solution:** Clear your browser cache and reload the page

## Support

If you encounter any issues, refer to:
- `DEPLOYMENT.md` for detailed deployment instructions
- `RELEASE_NOTES.md` for what's new in this version
- GitHub Issues for reporting problems
