
const SocialSharing = ({ handle, title, text }) => {
  const url = `https://sketchplanations.vercel.app/${handle}`
  const facebookUrl = `https://facebook.com/sharer/sharer.php?u=${url}`
  const twitterUrl = `https://twitter.com/intent/tweet/?text=${title}&url=${url}`
  const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${text}&source=${url}`
  const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${url}&amp;media=${url}&amp;description=${title}.`

  return (
    <>
      <div className='share-buttons'>
        {/* Facebook */}
        <a
          className='share-button__link'
          href={facebookUrl}
          target='_blank'
          rel='noreferrer'
          aria-label='Share on Facebook'
        >
          <div className='share-button share-button--facebook'>
            <div aria-hidden='true' className='share-button__icon share-button__icon--solid'>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                <path d='M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z' />
              </svg>
            </div>
            Share
          </div>
        </a>
        {/* Twitter */}
        <a
          className='share-button__link'
          href={twitterUrl}
          target='_blank'
          rel='noreferrer'
          aria-label='Share on Twitter'
        >
          <div className='share-button share-button--twitter'>
            <div aria-hidden='true' className='share-button__icon share-button__icon--solid'>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                <path d='M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z' />
              </svg>
            </div>
            Share
          </div>
        </a>
        {/* LinkedIn */}
        <a
          className='share-button__link'
          href={linkedInUrl}
          target='_blank'
          rel='noreferrer'
          aria-label='Share on LinkedIn'
        >
          <div className='share-button share-button--linkedin'>
            <div aria-hidden='true' className='share-button__icon share-button__icon--solid'>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                <path d='M6.5 21.5h-5v-13h5v13zM4 6.5C2.5 6.5 1.5 5.3 1.5 4s1-2.4 2.5-2.4c1.6 0 2.5 1 2.6 2.5 0 1.4-1 2.5-2.6 2.5zm11.5 6c-1 0-2 1-2 2v7h-5v-13h5V10s1.6-1.5 4-1.5c3 0 5 2.2 5 6.3v6.7h-5v-7c0-1-1-2-2-2z' />
              </svg>
            </div>
            Share
          </div>
        </a>
        {/* Pinterest */}
        <a
          className='share-button__link'
          href={pinterestUrl}
          target='_blank'
          rel='noreferrer'
          aria-label='Share on Pinterest'
        >
          <div className='share-button share-button--pinterest'>
            <div aria-hidden='true' className='share-button__icon share-button__icon--solid'>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                <path d='M12.14.5C5.86.5 2.7 5 2.7 8.75c0 2.27.86 4.3 2.7 5.05.3.12.57 0 .66-.33l.27-1.06c.1-.32.06-.44-.2-.73-.52-.62-.86-1.44-.86-2.6 0-3.33 2.5-6.32 6.5-6.32 3.55 0 5.5 2.17 5.5 5.07 0 3.8-1.7 7.02-4.2 7.02-1.37 0-2.4-1.14-2.07-2.54.4-1.68 1.16-3.48 1.16-4.7 0-1.07-.58-1.98-1.78-1.98-1.4 0-2.55 1.47-2.55 3.42 0 1.25.43 2.1.43 2.1l-1.7 7.2c-.5 2.13-.08 4.75-.04 5 .02.17.22.2.3.1.14-.18 1.82-2.26 2.4-4.33.16-.58.93-3.63.93-3.63.45.88 1.8 1.65 3.22 1.65 4.25 0 7.13-3.87 7.13-9.05C20.5 4.15 17.18.5 12.14.5z' />
              </svg>
            </div>
            Share
          </div>
        </a>
      </div>
      <style jsx>{`
        .share-buttons {
          display: flex;
          width: 100%;
          margin: 1.5rem -0.25rem -0.25rem;
        }

        .share-buttons > * {
          margin: 0.25rem;
        }

        .share-button__link {
          text-decoration: none;
          color: #fff;
        }

        .share-button {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 5px;
          transition: 0.2s ease-out;
          padding: 0.5em 0.75em;
          font-size: 0.75rem;
        }

        .share-button__icon svg {
          width: 1em;
          height: 1em;
          margin-right: 0.4em;
          vertical-align: top;
        }

        /* Solid icons get a fill */
        .share-button__icon--solid {
          fill: #fff;
          stroke: none;
        }

        .share-button--twitter {
          background-color: #55acee;
        }

        .share-button--twitter:hover {
          background-color: #2795e9;
        }

        .share-button--facebook {
          background-color: #3b5998;
        }

        .share-button--facebook:hover {
          background-color: #2d4373;
        }

        .share-button--linkedin {
          background-color: #0077b5;
        }

        .share-button--linkedin:hover {
          background-color: #046293;
        }

        .share-button--facebook {
          background-color: #3b5998;
          border-color: #3b5998;
        }

        .share-button--facebook:hover,
        .share-button--facebook:active {
          background-color: #2d4373;
          border-color: #2d4373;
        }

        .share-button--twitter {
          background-color: #55acee;
          border-color: #55acee;
        }

        .share-button--twitter:hover,
        .share-button--twitter:active {
          background-color: #2795e9;
          border-color: #2795e9;
        }

        .share-button--linkedin {
          background-color: #0077b5;
          border-color: #0077b5;
        }

        .share-button--linkedin:hover,
        .share-button--linkedin:active {
          background-color: #046293;
          border-color: #046293;
        }

        .share-button--pinterest {
          background-color: #bd081c;
          border-color: #bd081c;
        }

        .share-button--pinterest:hover,
        .share-button--pinterest:active {
          background-color: #8c0615;
          border-color: #8c0615;
        }
      `}</style>
    </>
  )
}

export default SocialSharing
