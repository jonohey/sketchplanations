import { createElement } from 'react'

const TextHeader = ({ as = 'h1', children, ...props }) => {
  return (
    <>
      <div className='root'>{createElement(as, props, children)}</div>
      <style jsx>{`
        .root :global(h1) {
          @apply text-2xl mb-4 mx-auto;
          font-weight: 300;
        }

        @screen sm {
          .root :global(h1) {
            @apply text-3xl;
          }
        }

        .root :global(b) {
          font-weight: 600;
        }
      `}</style>
    </>
  )
}

export default TextHeader
