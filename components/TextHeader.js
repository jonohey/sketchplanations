import { createElement } from 'react'
import { RoughNotation } from 'react-rough-notation'

import styles from './TextHeader.module.css'

const TextHeader = ({ as = 'h1', children, ...props }) => {
  return (
    <div className={styles.root}>
      {createElement(
        as,
        props,
        <RoughNotation
          show
          iterations={1}
          animationDuration={500}
          animationDelay={250}
          strokeWidth={2}
          multiline
          padding={3}
        >
          {children}
        </RoughNotation>
      )}
    </div>
  )
}

export default TextHeader
