import sanityClient from '@sanity/client'
import blocksToHtml from '@sanity/block-content-to-html'
import imageUrlBuilder from '@sanity/image-url'
// _lodash
import get from 'lodash/get'
import remove from 'lodash/remove'
import fp from 'lodash/fp'

const tracer = x => {
    console.dir(x)
    return x
}

export const client = sanityClient({
    projectId: '883bmkra',
    dataset: 'production',
    token: '', // or leave blank to be anonymous user
    useCdn: false // `false` if you want to ensure fresh data
})

const h = blocksToHtml.h

const serializers = {
    marks: {
        link: props =>
            h(
                'a',
                { target: '_blank', rel: 'noreferrer', href: props.mark.href },
                props.children
            )
    }
}

export const renderBlockText = text =>
    blocksToHtml({
        blocks: text,
        serializers: serializers,
        imageOptions: { w: 600, h: 400, fit: 'max' },
        projectId: '883bmkra',
        dataset: 'production'
    })

export const toPlainText = (blocks = []) => {
    return (
        blocks
            // loop through each block
            .map(block => {
                // if it's not a text block with children,
                // return nothing
                if (block._type !== 'block' || !block.children) {
                    return ''
                }
                // loop through the children spans, and join the
                // text strings
                return block.children.map(child => child.text).join('')
            })
            // join the parapgraphs leaving split by two linebreaks
            .join('\n\n')
    )
}

const builder = imageUrlBuilder(client)

export const urlFor = source => builder.image(source)

export const loadData = async (query, params) => {
    try {
        const res = await client.fetch(query, params)
        if (res === null) {
            return Promise.reject();
        }
        return res

    } catch (err) {
        Sentry.captureException(err)
        return Promise.reject(new Error(404));
    }
}