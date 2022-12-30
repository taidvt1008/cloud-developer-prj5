import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getUserId } from '../utils';
import { getBlogs as getBlogsForUser } from '../../businessLogic/blogs'

import { createLogger } from '../../utils/logger'
const logger = createLogger("getBlogs")

// DONE: Get all blogs items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    logger.info(`Getting all blogs of user ${userId}`)

    const blogs = await getBlogsForUser(userId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: blogs
      })
    }
  })

handler
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))
