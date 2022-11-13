const fetch = require('node-fetch')
const { createClient } = require('@prismicio/client')
const apiEndpoint = 'https://sketchplanations.prismic.io/api/v2'

exports.client = createClient(apiEndpoint, { fetch })
