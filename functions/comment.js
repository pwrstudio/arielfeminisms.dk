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

    const id = get(event, 'queryStringParameters.id', false)

    if (!user || !id) {
        // Break if not authorized
        callback(
            null, {
            statusCode: 401,
            body: 'Unauthorized'
        });
    } else {

        const commentContent = get(event, 'queryStringParameters.comment', "")
        const title = get(event, 'queryStringParameters.title', "")
        const location = get(event, 'queryStringParameters.location', 0)
        const userName = get(user, 'user_metadata.name', '')
        const userId = get(user, 'sub', 'No ID')

        if (event.httpMethod === "POST") {
            // *** CREATE COMMENT

            // Construct comment document
            const doc = {
                _type: 'ygrgComment',
                title: title + ' – ' + userName,
                authorId: userId,
                authorName: userName,
                content: commentContent,
                textReference: {
                    _type: 'reference',
                    _ref: id,
                },
                location: location
            }

            // Create comment document
            client.create(doc).then(res => {
                callback(
                    null, {
                    statusCode: 201,
                    body: JSON.stringify(res)
                });
            }).catch(err => {
                console.error(err.message)
                callback(
                    null, {
                    statusCode: 500,
                    body: err.message
                });
            })

        } else if (event.httpMethod === "PUT") {
            // *** EDIT COMMENT

            client
                .patch(id) // Document ID to patch
                .set({ content: commentContent }) // Shallow merge
                .commit() // Perform the patch and return a promise
                .then(updatedComment => {
                    console.log(updatedComment)
                    callback(
                        null, {
                        statusCode: 200,
                        body: JSON.stringify(updatedComment)
                    });
                })
                .catch(err => {
                    console.error(err.message)
                    callback(
                        null, {
                        statusCode: 500,
                        body: err.message
                    });
                })

        } else if (event.httpMethod === "DEL") {
            // *** DELETE COMMENT

            // TODO: Check if users are the same before delete

            client.delete(id)
                .then(res => {
                    callback(
                        null, {
                        statusCode: 200,
                        body: 'DEL'
                    });
                })
                .catch(err => {
                    console.error('Delete failed: ', err.message)
                    callback(
                        null, {
                        statusCode: 500,
                        body: err.message
                    });
                })

        }

    }
}