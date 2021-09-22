import Link from 'next/link'

const Tags = ({ tags }) => {
  if (!tags) return null

  return (
    <>
      <div className='tags'>
        {tags.map(({ data: { identifier: tag }, slugs }) => (
          <Link key={tag} href={`/tags/${slugs[0]}`}>
            <a>{tag}</a>
          </Link>
        ))}
      </div>
      <style jsx>
        {`
          .tags {
            @apply flex flex-wrap justify-center p-6;
          }

          .tags > span {
            @apply relative py-2 m-2 rounded-full text-sm;
          }

          @screen sm {
            .tags > span {
              @apply text-base;
            }
          }

          .tags a {
            @apply relative py-2 px-4 m-2 rounded-full border text-sm;
            transition: all 0.1s ease-out;
          }

          @screen sm {
            .tags a {
              @apply text-base;
            }
          }

          .tags b {
            @apply text-xs;
            opacity: 0.5;
          }

          .tags a:hover {
            @apply bg-brightRed text-white border-brightRed shadow;
          }
        `}
      </style>
    </>
  )
}

export default Tags
