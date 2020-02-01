/**
 *
 * Add, edit and delete comments
 *
 */


// https://docs.netlify.com/functions/build-with-javascript/#runtime-settings


// {
//     "path": "Path parameter",
//     "httpMethod": "Incoming request's method name"
//     "headers": {Incoming request headers}
//     "queryStringParameters": {query string parameters }
//     "body": "A JSON string of the request payload."
//     "isBase64Encoded": "A boolean flag to indicate if the applicable request payload is Base64-encode"
// }

// client
//   .patch('bike-123') // Document ID to patch
//   .set({inStock: false}) // Shallow merge
//   .inc({numSold: 1}) // Increment field by count
//   .commit() // Perform the patch and return a promise
//   .then(updatedBike => {
//     console.log('Hurray, the bike is updated! New document:')
//     console.log(updatedBike)
//   })
//   .catch(err => {
//     console.error('Oh no, the update failed: ', err.message)
//   })

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
        statusCode: 200,
        body: JSON.stringify({
            result: { user: user, identity: identity, event: event, token: process.env.SANITY_TOKEN }
        })
    });

}