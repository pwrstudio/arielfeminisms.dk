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

const get = require('lodash/get');

const sanityClient = require('@sanity/client')
const client = sanityClient({
    projectId: '883bmkra',
    dataset: 'production',
    token: process.env.SANITY_TOKEN
})

exports.handler = function (event, context, callback) {

    const { identity, user } = context.clientContext;

    // Construct comment document
    const doc = {
        _type: 'ygrgComment',
        title: 'Comment by ' + get(user, 'user_metadata.name', 'Anon'),
        authorId: get(user, 'sub', 'No ID'),
        authorName: get(user, 'user_metadata.name', 'Anon'),
        content: get(event, 'queryStringParameters.comment', "default comment"),
        textReference: {
            _type: 'reference',
            _ref: get(event, 'queryStringParameters.id', "null"),
        },
        location: '0'
    }

    // Create comment document
    client.create(doc).then(res => {
        console.log(`Comment was created, document ID is ${res._id}`)
        callback(
            null, {
            statusCode: 200,
            body: JSON.stringify(res)
        });
    })



    // if (!user) {
    //     callback(
    //         null, {
    //         statusCode: 401,
    //         body: 'Unauthorized'
    //     });
    // } else {
    // callback(
    //     null, {
    //     statusCode: 200,
    //     body: JSON.stringify({ user: user, event: event })
    // });
    // }

}