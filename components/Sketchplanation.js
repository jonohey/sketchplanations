import { sort } from 'fast-sort'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { RichText } from 'prismic-reactjs'
import React, { useState } from 'react'
import TextLoop from 'react-text-loop'
import Shiitake from 'shiitake'

import styles from './Sketchplanation.module.css'

const SocialSharing = dynamic(() => import('./SocialSharing'))
const TextHeader = dynamic(() => import('./TextHeader'))
const PayWhatYouWant = dynamic(() => import('./PayWhatYouWant'))
const Modal = dynamic(() => import('./Modal'))

const renderImage = ({ image, title }) => {
  const { width, height } = image.dimensions
  const heightRatio = width / height
  const adjustedWidth = 1600
  const adjustedheight = adjustedWidth * heightRatio

  return (
    <Image
      src={image.url}
      alt={image.alt || `${title} - Sketchplanations`}
      width={adjustedWidth}
      height={adjustedheight}
      sizes='(min-width: 648px) 600px, (min-width: 640px) calc(100vw - 3rem), 100w'
    />
  )
}

const Sketchplanation = ({ sketchplanation, fullPost = false, hideContent = false }) => {
  const [pwywModalOpen, setPwywModalOpen] = useState(false)
  const {
    data: { image, title, body, redbubble_link_url },
    uid,
  } = sketchplanation

  const tags = sort(sketchplanation.data.tags).asc()

  return (
    <div className={styles.root}>
      {fullPost ? (
        <div className={styles.image}>{renderImage({ image, title })}</div>
      ) : (
        <Link href={`/${uid}`} className={styles.image}>
          {renderImage({ image, title })}
        </Link>
      )}
      <div className={styles.content}>
        {!hideContent && (
          <>
            {fullPost ? (
              <TextHeader>{title}</TextHeader>
            ) : (
              <Link href={`/${uid}`}>
                <TextHeader>{title}</TextHeader>
              </Link>
            )}
            <div className={styles.body}>
              {fullPost ? (
                <RichText render={body} />
              ) : (
                <>
                  <Shiitake lines={3} throttleRate={200}>
                    {RichText.asText(body)}
                  </Shiitake>
                  <Link href={`/${uid}`}>Read more…</Link>
                </>
              )}
            </div>
          </>
        )}
        {fullPost && (
          <>
            <div className={styles['after-post']}>
              <div className={styles['licence-note']}>
                <p>
                  You’re welcome to use and share this image and text for non-commercial purposes with attribution. Go
                  wild!
                  <br />
                  <a href='/licence' target='_blank' className={styles['licence-link']}>
                    See licence
                  </a>
                </p>
              </div>
              {redbubble_link_url && (
                <div className={styles['redbubble-wrapper']}>
                  <a className={styles.redbubble} href={redbubble_link_url} target='_blank' rel='noreferrer'>
                    <svg width='19' height='19' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                      <path d='M24 3l-.743 2h-1.929l-3.474 12h-13.239l-4.615-11h16.812l-.564 2h-13.24l2.937 7h10.428l3.432-12h4.195zm-15.5 15c-.828 0-1.5.672-1.5 1.5 0 .829.672 1.5 1.5 1.5s1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5zm6.9-7-1.9 7c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5z' />
                    </svg>
                    <span>Order as a </span>
                    <TextLoop>
                      <span>print</span>
                      <span>sticker</span>
                      <span>postcard</span>
                      <span>poster</span>
                      <span>greeting card</span>
                      <span>magnet</span>
                    </TextLoop>
                  </a>
                </div>
              )}
              <button className={styles['pwyw-button']} type='button' onClick={() => setPwywModalOpen(true)}>
                <svg width='14' height='19' xmlns='http://www.w3.org/2000/svg'>
                  <path d='M11.951 7.095L7.757 11.29V0H6.243v11.29L2.05 7.095.979 8.166 7 14.187l6.022-6.021-1.07-1.07zM0 16.964h14v1.513H0v-1.513z' />
                </svg>
                Download highest-quality image
              </button>
              <Modal show={pwywModalOpen} onHide={() => setPwywModalOpen(false)}>
                <div className={styles.pwyw}>
                  <PayWhatYouWant sketchplanationUid={sketchplanation.uid} sketchplanationTitle={title} />
                </div>
              </Modal>
              <SocialSharing handle={uid} title={title} text={RichText.asText(body)} />
              <ul className={styles.tags}>
                {tags.map((tag, index) => (
                  <li key={index}>
                    <Link key={tag} href={`/tags/${tag.tag.slug}`}>
                      {tag.tag.slug.replace(/-/, ' ')}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Sketchplanation
