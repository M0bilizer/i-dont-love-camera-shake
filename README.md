# Introduction

![Screenshot of the website](/docs/screenshot.png)

<p align="center">
 <a href="https://idontlikecamerashake.com">
  https://idontlikecamerashake.com
 </a>
</p>

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

<br/>

---

# Testing the image processing

We provide two method for testing the image processing. 

- The first method is the expected method: visiting https://idontlikecamerashake.com and uploading your images.
  - This is very straightforward, so no documentation is provided
- The second method is to send API request to the backend.
  - This requires networking knowledge and understanding of using `curl`. If you are using MacOS or Linux, you should using the respective command.

We provide some samples image from the GoPro Image Deblurring Dataset.

## Using API Request to the backend

Endpoint: https://api.idontlikecamerashake.com

We'll use `Test Images/blurry-demo-1.png` for this example

1. Send a POST request to /UploadUrl to get a S3 presigned url
- It should have a json with fileType "image/jpeg" or "image/png"
```bash
curl -X POST 'https://api.idontlikecamerashake.com/uploadUrl' \
  -H 'Content-Type: application/json' \
  -d '{"fileType": "image/png"}'
```

2. Use the returned `UploadUrl` to **PUT** your image directly into S3.
- Put the `UploadUrl` into the hostname of the curl command
```bash
curl -X PUT -T "'Test Images/blurry-demo-1.png" \
  -H "Content-Type: image/png" \
  "https://upload-idontlikecamerashake-com.s3.ap-southeast-5.amazonaws.com/..."
```

3. Use the `futureImageUrl` to continously poll the image until ready.
- Put the `futureImageUrl` into the hostname of the curl command
- If it returns 404 not found. Try again. The image processing takes some time.
- It may take more than a minute, but usually it'll be quick.
- You can also just paste the `futureImageUrl` into your browser.
```bash
curl https://processed-idontlikecamerashake-com.s3.amazonaws.com/...
```

<br/>

---

# Running the frontend

In this section, you will learn about running this application on your **local**.
If you are interested in seeing the production website, see [https://idontlikecamerashake.com](https://idontlikecamerashake.com)

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

<br/>

---

# Running the Lambda functions

Under the `lambda` folder, you will find two `.mjs` javascript file and a layer folder.
You can merely copy and paste the `.mjs` to the AWS Lambda Console to run the code, but you will need to upload the layer zip file (./lambda/replicate-layer/replicate-layer.zip) for it to work.

You'll need to configure the Lambda to depend on the API Gateway.

If you are more interested in just sending request to the backend. See the API documentation.

<br/>

---

# API Documentation

## GET Upload
Endpoint: `POST https://api.idontlikecamerashake.com/uploadUrl`
Purpose: Get a pre-signed S3 URL to upload your image securely.

- Sample Request
```json
{
  "fileType": "image/jpeg" // Supported: "image/jpeg", "image/png"
}
```

- Sample Response
```json
{
  "message": "Pre-signed URL generated successfully",
  "uploadUrl": "https://upload-idontlikecamerashake-com.s3.ap-southeast-5.amazonaws.com/...", // Pre-signed S3 PUT URL
  "imageId": "a1b2c3d4", // Unique ID for your image
  "futureImageUrl": "https://processed-idontlikecamerashake-com.s3.amazonaws.com/..." // Where to fetch processed result later
}
```

- Example Curl
```bash
curl -X POST 'https://api.idontlikecamerashake.com/uploadUrl' \
  -H 'Content-Type: application/json' \
  -d '{"fileType": "image/jpeg"}'
```

## Uploading the image to S3
Use the `UploadUrl` from the response to **PUT** your image directly into S3:
```bash
curl -X PUT -T "/path/to/your-image.jpg" \
  -H "Content-Type: image/jpeg" \
  "https://upload-idontlikecamerashake-com.s3.ap-southeast-5.amazonaws.com/..."
```
  - Note: Headers like Content-Type must match the file type.
After Upload, the backend will automatically process the image

## Fetch Processed Result
Endpoint: `GET {futureImageUrl}`
Response:
- Error 404 Not Found
- 200 OK

<br/>

---

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
