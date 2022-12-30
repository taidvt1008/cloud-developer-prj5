import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// DONE: Implement the fileStogare logic

const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})

export function generatePresignedUrl(imageId: string) {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: imageId,
        Expires: Number(urlExpiration)
    })
}

export function deleteObject(imageId: string) {
    return s3.deleteObject({
        Bucket: bucketName,
        Key: imageId
    }, function (err, data) {
        if (err) console.log(err, err.stack);   // an error occurred
        else console.log(data);                 // successful response
    })
}

export function getAttachmentUrl(imageId: string) {
    return `https://${bucketName}.s3.amazonaws.com/${imageId}`
}