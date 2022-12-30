import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getUserId } from '../utils'
import { updateBlog, createAttachmentPresignedUrl } from '../../businessLogic/blogs'
import { getAttachmentUrl, deleteObject } from '../../dataLayer/s3Utils';
import { UpdateBlogRequest } from '../../requests/UpdateBlogRequest'
import * as uuid from 'uuid'

import { createLogger } from '../../utils/logger'
const logger = createLogger("updateBlog")

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const blogId = event.pathParameters.blogId
    const updatedBlog: UpdateBlogRequest = JSON.parse(event.body)
    // DONE: Update a blog item with the provided id using values in the "updatedBlog" object

    //validate param blogId
    if (!blogId || blogId.trim() === "") {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: `Invalid blog id`
        })
      }
    }

    //validate all required fields: title, content
    if (!updatedBlog.title || updatedBlog.title.trim() == "") {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: `blog.title is required`
        })
      }
    }
    if (!updatedBlog.content || updatedBlog.content.trim() == "") {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: `blog.content is required`
        })
      }
    }
    if (!updatedBlog.imageUrl || updatedBlog.imageUrl.trim() == "") {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: `blog.imageUrl image is required`
        })
      }
    }
    if (updatedBlog.changedImage === undefined) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: `blog.changedImage is required`
        })
      }
    }

    try {
      const userId = getUserId(event);

      const imageId = updatedBlog.imageUrl.split("/")[updatedBlog.imageUrl.split("/").length - 1]
      logger.info(`imageId: ${imageId}`)

      var url: string = ""
      if (updatedBlog.changedImage) {
        await deleteObject(imageId)
        const img = uuid.v4()
        url = await createAttachmentPresignedUrl(img)
        updatedBlog.imageUrl = getAttachmentUrl(img)
      }

      logger.info(`${userId} is updating blog item id=${blogId} with new data: ${JSON.stringify(updatedBlog)}`)

      await updateBlog(userId, blogId, updatedBlog)

      return {
        statusCode: 200,
        body: JSON.stringify({ url })
      }

    } catch (err) {

      logger.error(`Update item with blogId=${blogId} failure: ${err}`)
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: `Update item with blogId=${blogId} failure: ${err}`
        })
      }

    }

  })

handler
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))