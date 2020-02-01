/**
 *
 * Add, edit and delete comments
 *
 */

// {
//     "path": "Path parameter",
//     "httpMethod": "Incoming request's method name"
//     "headers": {Incoming request headers}
//     "queryStringParameters": {query string parameters }
//     "body": "A JSON string of the request payload."
//     "isBase64Encoded": "A boolean flag to indicate if the applicable request payload is Base64-encode"
// }

// const sanityClient = require('@sanity/client')
// const client = sanityClient({
//     projectId: '883bmkra',
//     dataset: 'production',
//     token: SANITY_TOKEN, // or leave blank to be anonymous user
//     useCdn: true // `false` if you want to ensure fresh data
// })

exports.handler = function (event, context, callback) {

    const { identity, user } = context.clientContext;

    callback(
        null, {
        statusCode: 400,
        body: JSON.stringify({
            result: { user: user, identity: identity, event: event }
        })
    });

}