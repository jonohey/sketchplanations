import { createClient } from '@prismicio/client'

const apiEndpoint = 'https://sketchplanations.prismic.io/api/v2'

export const client = createClient(apiEndpoint)
