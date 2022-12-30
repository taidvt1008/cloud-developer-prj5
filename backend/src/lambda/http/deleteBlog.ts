import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getUserId } from '../utils'
import { deleteBlog } from '../../businessLogic/blogs'

import { createLogger } from '../../utils/logger'
const logger = createLogger("deleteBlog")

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const blogId = event.pathParameters.blogId
    // DONE: Remove a blog item by id

    //validate param blogId
    if (!blogId || blogId.trim() === "") {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: `Invalid blogId`
        })
      }
    }

    try {

      const userId = getUserId(event);
      logger.info(`Deleting blog item of user ${userId} with blogId=${blogId}`)

      await deleteBlog(userId, blogId);

      return {
        statusCode: 200,
        body: null
      }

    } catch (err) {

      logger.error(`Delete blog item with blogId=${blogId} failure: ${err}`)
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: `Delete blog item with blogId=${blogId} failure: ${err}`
        })
      }

    }
  }
)

handler
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))
