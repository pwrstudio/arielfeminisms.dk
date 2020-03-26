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
    const id = get(event, 'queryStringParameters.id', false)

    // console.log(user)
    console.dir(event)
    console.log(id)
    console.dir(user)

    const doc = {
        _id: id,
        _type: 'userAvatar',
        title: 'Avatar ' + id,
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