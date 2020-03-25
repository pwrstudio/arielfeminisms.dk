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

    // const { user } = context.clientContext;
    const id = get(event, 'queryStringParameters.id', false)

    // console.log(user)
    console.dir(event.body)
    console.log(id)

    client.assets
        .upload('image', event.body, { filename: id + '.jpg' })
        .then(document => {
            console.dir(document)

            const doc = {
                _type: 'userAvatar',
                title: id
            }

            client.createOrReplace(doc).then(res => {
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
        })

        .catch(error => {
            console.error('Upload failed:', error.message)
            callback(
                null, {
                statusCode: 666,
                body: JSON.stringify(error.message)
            });
        })
}