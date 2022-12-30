import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getUserId } from '../utils';
import { findBlogByName } from '../../businessLogic/blogs'

import { createLogger } from '../../utils/logger'
const logger = createLogger("findBlogByName")

// DONE: Get all blogs items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const name =  event.queryStringParameters["name"]
    const userId = getUserId(event);
    logger.info(`Finding blogs of user ${userId} by name ${name}`)

    const blogs = await findBlogByName(userId, name);

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
