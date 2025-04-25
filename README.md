# Introduction

![Screenshot of the website](/docs/screenshot.png)

Welcome to **I Don't Like Camera Shake**, a **100% serverless** cloud computing project designed to deblur images using advanced algorithms.

This web application allows users to upload **blurry images** caused by camera shake or motion blur and applies an AI-powered deblurring process to restore clarity. The processed images can then be downloaded in high quality.

## Features

![High Level System Architecture of the website](/docs/aws.png)

- 🚀 Fully Serverless: No backend servers (AWS Lambda/API Gateway/S3 Bucket).

- 🔍 AI-Powered Deblurring: Removes motion blur/camera shake using [NAFNet](https://github.com/megvii-research/NAFNet).

- ⚡ Scalable & Cheap: Auto-scales with near-zero cost when idle.

- 🖥️ Simple UI: Upload → Process → Download.

## Team
- Rakichaz C. Caballero
- Ananda I. Tan
- Siddhartha M. Narasipuram

# Running the frontend

In this section, you will learn about running this application on your **local**.

## Prerequisite

The frontend is using **Bun** as the package manager.

## Steps

1. Install ```bun``` onto your system
- If you are familiar with npm: You can just use
```bash
npm install -g bun
```
- Else, you will need to install ```bun``` directly into your system:
  - For MacOS/Linux: run this command using your favourite terminal
```bash
curl -fsSL https://bun.sh/install | bash
```
  - For Windows: run this command using your favourite terminal
```powershell
powershell -c "irm bun.sh/install.ps1|iex"
```

2. Navigate to the frontend directory:
- Run this command
```bash
cd www
```

3. Install dependencies:
- Run this command
```bash
bun install
```

3. Start the application:
- Run this command
```bash
bun dev
```

# Running the Lambda functions

Under the `lambda` folder, you will find two `.mjs` javascript file and a layer folder.
You can merely copy and paste the `.mjs` to the AWS Lambda Console to run the code, but you will need to upload the layer zip file (./lambda/replicate-layer/replicate-layer.zip) for it to work.

You'll need to configure the Lambda to depend on the API Gateway.

# File Structure

```
.
├── diagram                 # Draw.io diagrams that illustrate System Architecture
├── lambda                  # Lambda function
| └── replicate-layer       # Lambda layer
├── old                     # Deprecated files. Ignore this
├── www                     # React Frontend
├── .gitignore
└── README.md
```