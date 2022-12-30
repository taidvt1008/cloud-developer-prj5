import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
// import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { BlogItem } from '../models/BlogItem'
import { BlogUpdate } from '../models/BlogUpdate';

import { createLogger } from '../utils/logger'
const logger = createLogger("blogsAccess")

const XAWS = AWSXRay.captureAWS(AWS)

export class BlogsAccess {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly blogsTable = process.env.BLOGS_TABLE) {
    }

    async getBlog(userId: string): Promise<BlogItem[]> {
        logger.info(`getBlog with user ${userId}`)

        const result = await this.docClient.query({
            TableName: this.blogsTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()
        return result.Items as BlogItem[]
    }

    // async getBlogById(userId: String, blogId: String,): Promise<BlogItem> {
    //     logger.info("Get todo item by id from dynamodb");

    //     const result = await this.docClient.get({
    //         TableName: this.blogsTable,
    //         Key: {
    //             "blogId": blogId,
    //             "userId": userId
    //         },
    //     }).promise()

    //     if (!result.Item) {
    //         throw new Error(`Blog not found with id ${blogId}`)
    //     }

    //     const items = result.Item
    //     return items as BlogItem
    // }

    async createBlog(newBlog: BlogItem): Promise<BlogItem> {
        logger.info(`createBlog with item: ${JSON.stringify(newBlog)}`)

        await this.docClient.put({
            TableName: this.blogsTable,
            Item: newBlog
        }).promise()
        return newBlog
    }

    async updateBlog(userId: string, blogId: string, blog: BlogUpdate): Promise<void> {
        logger.info(`updateBlog with new info ${JSON.stringify(blog)} having blogId=${blogId} with user ${userId}`)

        await this.docClient.update({
            TableName: this.blogsTable,
            Key: {
                "blogId": blogId,
                "userId": userId
            },
            UpdateExpression: 'set title = :title, content = :content, imageUrl = :imageUrl, updatedAt = :updatedAt',
            ExpressionAttributeValues: {
                ":title": blog.title,
                ":content": blog.content,
                ":imageUrl": blog.imageUrl,
                ":updatedAt": blog.updatedAt
            },
            ReturnValues: "UPDATED_NEW"
        }).promise()
    }

    async deleteBlog(userId: string, blogId: string): Promise<void> {
        logger.info(`deleteBlog blogId=${blogId} with user ${userId}`)

        await this.docClient.delete({
            TableName: this.blogsTable,
            Key: {
                "blogId": blogId,
                "userId": userId
            }
        }).promise();
    }

    async findBlogByName(userId: string, name: string): Promise<BlogItem[]> {
        logger.info(`findBlogByName of user ${userId} by name ${name}`)

        const result = await this.docClient
            .query({
                TableName: this.blogsTable,
                KeyConditionExpression: 'userId = :userId',
                FilterExpression: ' contains(content, :key) or contains (title, :key)',
                ExpressionAttributeValues: {
                    ':key': name,
                    ':userId': userId
                }
            })
            .promise();
        const diaryItem = result.Items;
        return diaryItem as BlogItem[];
    }
}
