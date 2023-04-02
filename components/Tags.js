import Link from 'next/link'

import { isBlank } from 'helpers'

import styles from './Tags.module.css'

const Tags = ({ tags }) => {
  if (isBlank(tags)) return null

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
