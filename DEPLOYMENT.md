# BlockPlane Metric: Netlify Deployment Guide

This guide provides step-by-step instructions for deploying the BlockPlane Metric application to Netlify directly from this GitHub repository.

## 1. Prerequisites

- **Netlify Account**: You must have a Netlify account. If you don’t, you can sign up for free at [netlify.com](https://www.netlify.com).
- **GitHub Repository**: This repository should be available in your GitHub account.

## 2. Deployment Steps

### Step 1: Create a New Site from Git

1.  Log in to your Netlify account.
2.  Click the **“Add new site”** button and select **“Import an existing project”** from the dropdown menu.
3.  Connect to **GitHub** as your Git provider.
4.  Authorize Netlify to access your GitHub account and select the `Block-Plane-Metric` repository.

### Step 2: Configure Build Settings

Netlify will automatically detect the `netlify.toml` file in the repository and configure the build settings. You should verify that the following settings are applied:

| Setting              | Value                               |
| -------------------- | ----------------------------------- |
| **Build command**    | `echo 'Static site - no build...'`  |
| **Publish directory**| `public`                            |

These settings instruct Netlify to deploy the contents of the `public` directory without running a build command, which is ideal for our static HTML/CSS/JS setup.

### Step 3: Deploy the Site

1.  Click the **“Deploy site”** button.
2.  Netlify will begin the deployment process, which should take less than a minute.
3.  Once complete, Netlify will provide you with a unique URL (e.g., `https://random-name-12345.netlify.app`).

## 3. Verification

1.  **Visit the Root URL**: Open the Netlify URL provided. You should see the main landing page.
2.  **Access the Calculator**: Click the **“Launch Free Calculator”** button or navigate to `/metric` (e.g., `https://your-site.netlify.app/metric`). The BlockPlane Metric calculator should load with all the latest fixes.

## 4. Repository Structure

-   `public/`: This directory contains all static assets that will be deployed to Netlify.
-   `public/index.html`: The main landing page.
-   `public/metric/index.html`: The standalone BlockPlane Metric calculator.
-   `netlify.toml`: The Netlify configuration file that handles routing and build settings.
-   `src/`: Contains the TypeScript source code for the backend and future React components.

This structure ensures that the static calculator and the TypeScript application can coexist and be deployed together seamlessly.
