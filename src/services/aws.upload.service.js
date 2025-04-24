const cloudinary = require('cloudinary').v2;
const { s3, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('../configs/s3.config');
const Utils = require('../utils');
// const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const { getSignedUrl } = require('@aws-sdk/cloudfront-signer')
const imageUrlPublic = process.env.AWS_CLOUDFRONT || 'https://d3sc9pwlohuokt.cloudfront.net'

const uploadImageFromLocalS3 = async ({
    file
}) => {
    try {
        const imageName = Utils.randomName()
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName, //file.originalname || 'unknown',
            Body: file.buffer,
            ContentType: 'image/jpeg',
        })

        const result = await s3.send(command)

         // export url
        const singedUrl = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName,
        });

        // S3
        // const url = await getSignedUrl(s3, singedUrl, { expiresIn: 3600 });

        // CloudFront URL export
        const url = getSignedUrl({
            url: `${imageUrlPublic}/${imageName}`,
            keyPairId: process.env.AWS_CLOUDFRONT_PUBLIC_KEY_ID,
            dateLessThan: new Date(Date.now() + 1000 * 60), // 60 seconds
            privateKey: process.env.AWS_CLOUDFRONT_PRIVATE_KEY,
          });
 
        return {
            url,
            result 
        }
    } catch (error) {
        console.error(`Error upload image use S3Client::: ${error}`)
    }
}

module.exports = {
    uploadImageFromLocalS3
}