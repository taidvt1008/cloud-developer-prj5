import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getUserId } from '../utils';
import { createBlog, createAttachmentPresignedUrl } from '../../businessLogic/blogs'
import { getAttachmentUrl } from '../../dataLayer/s3Utils';
import { CreateBlogRequest } from '../../requests/CreateBlogRequest'
import * as uuid from 'uuid'

import { createLogger } from '../../utils/logger'
const logger = createLogger("createBlog")

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newBlog: CreateBlogRequest = JSON.parse(event.body)
    // DONE: Implement creating a new blog item

    //validate all required fields: title, content
    if (!newBlog.title || newBlog.title.trim() == "") {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: `blog.title is required`
        })
      }
    }
    if (!newBlog.content || newBlog.content.trim() == "") {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: `blog.content is required`
        })
      }
    }

    try {

      const userId = getUserId(event);
      logger.info(`${userId} is creating a new blog item: ${JSON.stringify(newBlog)}`)
      
      const img = uuid.v4()
      const presignedUrl: string = await createAttachmentPresignedUrl(img)
      newBlog.imageUrl = getAttachmentUrl(img)

      const blogItem = await createBlog(userId, newBlog)
      return {
        statusCode: 201,
        body: JSON.stringify({ item: blogItem, url: presignedUrl  })
      }

    } catch (err) {

      logger.error(`Create new blog failure: ${err}`)
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: `Create new blog failure: ${err}`
        })
      }

    }
  })

handler
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))
