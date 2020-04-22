/**
 *
 * Upload avatar picture
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

    if (!user || !user.sub) {
        // Break if not authorized
        callback(
            null, {
            statusCode: 401,
            body: 'Unauthorized'
        });
    } else {

        const doc = {
            _id: user.sub,
            _type: 'userAvatar',
            title: 'Avatar for ' + get(user, 'user_metadata.name', user.sub),
            image: event.body
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

    }

}