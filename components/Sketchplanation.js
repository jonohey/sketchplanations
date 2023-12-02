import { sort } from 'fast-sort'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { RichText } from 'prismic-reactjs'
import React, { useState } from 'react'
import TextLoop from 'react-text-loop'
import Shiitake from 'shiitake'

import styles from './Sketchplanation.module.css'
import SketchplanationImage from './SketchplanationImage'

const SocialSharing = dynamic(() => import('./SocialSharing'))
const TextHeader = dynamic(() => import('./TextHeader'))
const PayWhatYouWant = dynamic(() => import('./PayWhatYouWant'))
const Modal = dynamic(() => import('./Modal'))

const Sketchplanation = ({ sketchplanation, fullPost = false, hideContent = false, priority = false }) => {
  const [pwywModalOpen, setPwywModalOpen] = useState(false)
  const {
    data: { image, title, body, redbubble_link_url, podcast_link_url },
    uid,
  } = sketchplanation

  const tags = sort(sketchplanation.data.tags).asc()

  return (
    <div className={styles.root}>
      {fullPost ? (
        <div className={styles.image}>
          <SketchplanationImage image={image} title={title} priority={true} onDownload={() => setPwywModalOpen(true)} />
        </div>
      ) : (
        <Link href={`/${uid}`} className={styles.image}>
          <SketchplanationImage image={image} title={title} priority={priority} lightbox={false} />
        </Link>
      )}
      <div className={styles.content}>
        {!hideContent && (
          <>
            {fullPost ? (
              <TextHeader>{title}</TextHeader>
            ) : (
              <Link href={`/${uid}`}>
                <TextHeader as='h2'>{title}</TextHeader>
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
                    <div className={styles['action-icon']}>
                      <svg width='19' height='19' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                        <path d='M24 3l-.743 2h-1.929l-3.474 12h-13.239l-4.615-11h16.812l-.564 2h-13.24l2.937 7h10.428l3.432-12h4.195zm-15.5 15c-.828 0-1.5.672-1.5 1.5 0 .829.672 1.5 1.5 1.5s1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5zm6.9-7-1.9 7c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5z' />
                      </svg>
                    </div>
                    <span>Order as a&nbsp;</span>
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
              {podcast_link_url && (
                <div className={styles['podcast-wrapper']}>
                  <a className={styles.podcast} href={podcast_link_url} target='_blank' rel='noreferrer'>
                    <div className={styles['action-icon']}>
                      <svg xmlns='http://www.w3.org/2000/svg' width='17' height='17' viewBox='0 0 24 24'>
                        <path d='M6.043 17.496 4.56 19.001C1.77 16.8 0 13.588 0 10s1.77-6.8 4.561-9l1.483 1.504C3.717 4.339 2.239 7.016 2.239 10s1.478 5.661 3.804 7.496zM15 10a3 3 0 0 0-6 0c0 1.304.838 2.403 2 2.816V23h2V12.816A2.992 2.992 0 0 0 15 10zm-8.282 0c0-1.791.887-3.398 2.282-4.498L7.519 4c-1.86 1.467-3.04 3.608-3.04 6s1.18 4.533 3.04 6L9 14.498c-1.396-1.1-2.282-2.707-2.282-4.498zM19.44 1l-1.483 1.504c2.326 1.835 3.804 4.512 3.804 7.496s-1.478 5.661-3.804 7.496l1.483 1.505C22.23 16.8 24 13.588 24 10s-1.77-6.8-4.56-9zm-2.959 3L15 5.502c1.396 1.101 2.282 2.707 2.282 4.498s-.886 3.398-2.282 4.498L16.481 16c1.86-1.467 3.04-3.608 3.04-6s-1.179-4.533-3.04-6z' />
                      </svg>
                    </div>
                    <span>Listen to {title} in the podcast</span>
                  </a>
                </div>
              )}
              <button className={styles['pwyw-button']} type='button' onClick={() => setPwywModalOpen(true)}>
                <div className={styles['action-icon']}>
                  <svg width='14' height='19' xmlns='http://www.w3.org/2000/svg'>
                    <path d='M11.951 7.095L7.757 11.29V0H6.243v11.29L2.05 7.095.979 8.166 7 14.187l6.022-6.021-1.07-1.07zM0 16.964h14v1.513H0v-1.513z' />
                  </svg>
                </div>
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
