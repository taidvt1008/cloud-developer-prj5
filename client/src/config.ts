// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'qclj5dlts3'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // DONE: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-ei4oi0c6qof1w33u.us.auth0.com',            // Auth0 domain
  clientId: 'XXwVlkby69ZXJkOPpMSpZ1kEVGVYBpYR',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
