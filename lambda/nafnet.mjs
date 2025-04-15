import AWS from 'aws-sdk';
import Replicate from 'replicate';
import https from 'https';
import { v4 as uuidv4 } from 'uuid';


const s3 = new AWS.S3();
const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

exports.handler = async (event) => {
  try {
    // 1. Parse input (API Gateway sends body as string)
    const body = JSON.parse(event.body);
    const imageUrl = body.imageUrl; // Could be S3 URL or public URL
    
    // 2. Call Replicate
    const outputUrl = await replicate.run(
      "megvii-research/nafnet:018241a6c880319404eaa2714b764313e27e11f950a7ff0a7b5b37b27b74dcf7",
      { input: { image: imageUrl } }
    );

    // 3. Download processed image
    const imageBuffer = await new Promise((resolve, reject) => {
      https.get(outputUrl, (response) => {
        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => resolve(Buffer.concat(chunks)));
      }).on('error', reject);
    });

    // 4. Upload to S3
    const s3Key = `processed/${uuidv4()}.png`;
    await s3.putObject({
      Bucket: process.env.PROCESSED_BUCKET,
      Key: s3Key,
      Body: imageBuffer,
      ContentType: 'image/png'
    }).promise();

    // 5. Return result
    const processedUrl = `https://${process.env.PROCESSED_BUCKET}.s3.amazonaws.com/${s3Key}`;
    return {
      statusCode: 200,
      body: JSON.stringify({ processedUrl }),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};