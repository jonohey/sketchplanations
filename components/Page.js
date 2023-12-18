import * as prismicH from '@prismicio/helpers'
import { PrismicRichText } from '@prismicio/react'
import classNames from 'classnames'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { createElement } from 'react'

import { linkResolver } from 'services/prismic'

import styles from './Page.module.css'

const TextHeader = dynamic(() => import('./TextHeader'))

const Text = ({ slice }) => <PrismicRichText field={slice.primary.content} linkResolver={linkResolver} />

const Photo = ({
  slice: {
    primary: { photo },
  },
}) => (
  <div className='slice-image'>
    <Image
      className='block w-full'
      src={photo.url}
      width={photo.dimensions.width}
      height={photo.dimensions.height}
      alt={photo.alt}
      sizes='(min-width: 848px) 800px, (min-width: 640px) calc(100vw - 3rem), 100w'
    />
  </div>
)

const Html = ({ slice }) => <div dangerouslySetInnerHTML={{ __html: prismicH.asText(slice.primary.html) }} />

const sliceTypesToComponent = {
  text: Text,
  photo: Photo,
  html: Html,
}

const Page = ({
  document: {
    data: { title, body },
  },
  inline = false,
  children,
}) => {
  return (
    <div className={classNames(styles['page-root'], inline && styles['page-root--inline'], 'prose')}>
      <TextHeader>{title}</TextHeader>
      <div className={styles['page-body']}>
        {body.map((slice, index) => createElement(sliceTypesToComponent[slice.slice_type], { key: index, slice }))}
        {children}
      </div>
    </div>
  )
}

export default Page
