/**
 *
 * Add, edit and delete comments
 *
 */

const get = require('lodash/get');

// const sanityClient = require('@sanity/client')
// const client = sanityClient({
//     projectId: '883bmkra',
//     dataset: 'production',
//     token: process.env.SANITY_TOKEN
// })

exports.handler = function (event, context, callback) {

    const { user } = context.clientContext;

    if (!user) {
        callback(
            null, {
            statusCode: 401,
            body: 'Unauthorized'
        });
    } else {

        user
            .update({ data: { avatar: 'XXX' } })
            .then(user => {
                callback(
                    null, {
                    statusCode: 200,
                    body: JSON.stringify(event)
                });
            })
            .catch(error => {
                callback(
                    null, {
                    statusCode: 500,
                    body: JSON.stringify(event)
                });
            });

    }
}