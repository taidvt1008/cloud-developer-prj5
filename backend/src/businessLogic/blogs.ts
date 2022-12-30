import { BlogsAccess } from '../dataLayer/blogsAccess'
import { generatePresignedUrl } from '../dataLayer/s3Utils';
import { BlogItem } from '../models/BlogItem'
import { CreateBlogRequest } from '../requests/CreateBlogRequest'
import { UpdateBlogRequest } from '../requests/UpdateBlogRequest'
import * as uuid from 'uuid'

import { createLogger } from '../utils/logger'
const logger = createLogger("blogs")

// DONE: Implement businessLogic
const blogAccess = new BlogsAccess();

export async function getBlogs(userId: string): Promise<BlogItem[]> {
    logger.info(`getBlogs with user ${userId}`)
    return blogAccess.getBlog(userId);
}

export async function createBlog(
    userId: string,
    createBlogRequest: CreateBlogRequest
): Promise<BlogItem> {

    logger.info(`createBlog item ${JSON.stringify(createBlogRequest)} with user ${userId}`)

    return await blogAccess.createBlog({
        userId: userId,
        blogId: uuid.v4(),
        title: createBlogRequest.title,
        content: createBlogRequest.content,
        imageUrl: createBlogRequest.imageUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    })
}

export async function updateBlog(
    userId: string,
    blogId: string,
    updateBlog: UpdateBlogRequest
): Promise<void> {

    updateBlog.updatedAt = new Date().toISOString()
    logger.info(`updateBlog with new info ${JSON.stringify(updateBlog)} having blogId=${blogId} with user ${userId}`)

    return blogAccess.updateBlog(userId, blogId, updateBlog)
}

export async function deleteBlog(
    userId: string,
    blogId: string
): Promise<void> {

    logger.info(`deleteBlog blogId=${blogId} with user ${userId}`)

    return blogAccess.deleteBlog(userId, blogId);
}

export async function createAttachmentPresignedUrl(
    imageId: string
): Promise<string> {

    logger.info(`createAttachmentPresignedUrl imageId=${imageId}`)

    return generatePresignedUrl(imageId)
}

export async function findBlogByName(userId: string, name: string): Promise<BlogItem[]> {
    logger.info(`findBlogByName of user ${userId} by name ${name}`)
    return blogAccess.findBlogByName(userId, name);
}

// export async function getBlogById(userId: string, blogId: string): Promise<BlogItem> {
//     logger.info(`getBlogById blogId=${blogId} with user ${userId}`)
//     return blogAccess.getBlogById(userId, blogId);
// }
