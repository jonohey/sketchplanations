import { RoughNotation } from 'react-rough-notation'
import { createElement } from 'react'

const TextHeader = ({ as = 'h1', children, ...props }) => {
  return (
    <>
      <div className='root'>
        {createElement(
          as,
          props,
          <RoughNotation show iterations={1} animationDuration={500} animationDelay={250} strokeWidth={2}>
            {children}
          </RoughNotation>
        )}
      </div>
      <style jsx>{`
        .root :global(h1) {
          @apply text-2xl mb-10 mx-auto;
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
