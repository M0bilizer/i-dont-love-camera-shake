const Replicate = require('replicate');
const AWS = require('aws-sdk');
const https = require('https');
const { Readable } = require('stream');

exports.handler = async (event) => {
    try {
        const replicate = new Replicate({
            auth: process.env.REPLICATE_API_TOKEN
        });
        
        const input = {
            image: event.imageUrl || "https://replicate.delivery/mgxm/e7a66188-34c6-483b-813f-be5c96a3952b/blurry-reds-0.jpg"
        };
        
        const output = await replicate.run(
            "megvii-research/nafnet:018241a6c880319404eaa2714b764313e27e11f950a7ff0a7b5b37b27b74dcf7", 
            { input }
        );
        
        const imageBuffer = await new Promise((resolve, reject) => {
            https.get(outputUrl, (response) => {
                const chunks = [];
                response.on('data', (chunk) => chunks.push(chunk));
                response.on('end', () => resolve(Buffer.concat(chunks)));
            }).on('error', reject);
        });

        const s3Params = {
            Bucket: process.env.OUTPUT_BUCKET || event.bucketName,
            Key: `outputs/${Date.now()}.png`, // or get filename from URL
            Body: imageBuffer,
            ContentType: 'image/png'
        };

        const s3Result = await s3.upload(s3Params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Success",
                s3Location: s3Result.Location,
                outputUrl: outputUrl
            })
        };
        
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Error processing request",
                error: error.message
            })
        };
    }
};