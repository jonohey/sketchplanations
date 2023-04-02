import Link from 'next/link'

import styles from './Tags.module.css'

const Tags = ({ tags }) => {
  if (!tags) return null

  return (
    <div className={styles.tags}>
      {tags.map(({ data: { identifier: tag }, slugs }) => (
        <Link key={tag} href={`/tags/${slugs[0]}`}>
          {tag}
        </Link>
      ))}
    </div>
  )
}

export default Tags
