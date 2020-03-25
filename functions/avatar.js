/**
 *
 * Add, edit and delete comments
 *
 */

const get = require('lodash/get');

const sanityClient = require('@sanity/client')
const client = sanityClient({
    projectId: '883bmkra',
    dataset: 'production',
    token: process.env.SANITY_TOKEN
})

exports.handler = function (event, context, callback) {

    const { user } = context.clientContext;

    console.dir(event)

    callback(
        null, {
        statusCode: 200,
        body: JSON.stringify(event)
    });

    if (!user) {
        callback(
            null, {
            statusCode: 401,
            body: 'Unauthorized'
        });
    } else {

        // const commentContent = get(event, 'queryStringParameters.comment', "")
        // const title = get(event, 'queryStringParameters.title', "")
        // const location = get(event, 'queryStringParameters.location', 0)
        // const userName = get(user, 'user_metadata.name', '')
        // const userId = get(user, 'sub', 'No ID')

        // Upload an image file from the file system
        // client.assets
        //     .upload('image', fs.createReadStream('myImage.jpg'))
        //     .then(document => {
        //         console.log('The image was uploaded!', document)
        //         callback(
        //             null, {
        //             statusCode: 200,
        //             body: JSON.stringify(document)
        //         });
        //     })
        //     .catch(error => {
        //         console.error('Upload failed:', error.message)
        //         callback(
        //             null, {
        //             statusCode: 500,
        //             body: error.message
        //         });
        //     })

    }
}