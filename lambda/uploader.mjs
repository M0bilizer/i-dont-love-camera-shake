import { S3Client, PutObjectCommand, HeadObjectCommand, NotFound } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Replicate from "replicate";
import https from "https";
import { v4 as uuidv4 } from "uuid";

const REGION = "ap-southeast-5";
const s3 = new S3Client({ region: REGION });
const maxAttempts = process.env.MAX_ATTEMPTS

export const handler = async (event) => {
    try {
        let imageId;
        let isUnique = false;
        let attempts = 0;

        // Keep generating IDs until we find a unique one or reach max attempts
        while (!isUnique && attempts < maxAttempts) {
            attempts++;
            imageId = uuidv4();
            try {
                const response = await s3.send(new HeadObjectCommand({
                    Bucket: process.env.UPLOAD_BUCKET,
                    Key: `${imageId}`
                }));
                console.log(`Image ID ${imageId} already exists, trying again...`);
            } catch (err) {
                if (err instanceof NotFound) {
                    isUnique = true;
                } else {
                    throw err;
                }
            }
        }

        if (!isUnique) {
            throw new Error('Failed to generate a unique image ID after multiple attempts');
        }

        // Generate pre-signed URL for PUT operation
        const command = new PutObjectCommand({
            Bucket: process.env.UPLOAD_BUCKET,
            Key: `${imageId}`,
            ContentType: 'image/*'
        });
        const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
        
        // Construct the response object
        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                message: "Pre-signed URL generated successfully",
                uploadUrl: uploadUrl,
                imageId: imageId,
                futureImageUrl: `https://${process.env.UPLOAD_BUCKET}.s3.amazonaws.com/uploads/${imageId}`
            })
        };
        
        return response;
        
    } catch (error) {
        console.error('Error generating pre-signed URL:', error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                message: "Error generating upload URL",
                error: error.message
            })
        };
    }
};