import classNames from 'classnames'
import { Search } from 'lucide-react'
import { useRef } from 'react'

import styles from './SearchForm.module.css'

import { isPresent } from 'helpers'

const SearchForm = ({ value, isBusy = false, onChange = () => {}, onClear = () => {}, ...props }) => {
  const inputRef = useRef(null)

  const handleClear = () => {
    onClear()
    inputRef.current.focus()
  }

  return (
    <div className={styles.root}>
      <div className={styles.icon}>
        <Search strokeWidth={1} size={22} />
      </div>
      <input
        ref={inputRef}
        className={styles.input}
        type='text'
        placeholder='Search…'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
      {isBusy && (
        <div className={styles['loading-indicator']}>
          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
            <path d='M0 11c.511-6.158 5.685-11 12-11s11.489 4.842 12 11h-2.009c-.506-5.046-4.793-9-9.991-9s-9.485 3.954-9.991 9h-2.009zm21.991 2c-.506 5.046-4.793 9-9.991 9s-9.485-3.954-9.991-9h-2.009c.511 6.158 5.685 11 12 11s11.489-4.842 12-11h-2.009z' />
          </svg>
        </div>
      )}
      <button
        onClick={handleClear}
        className={classNames(styles['reset-button'], isPresent(value) && styles['reset-button-active'])}
        type='button'
      >
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
          <path d='M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z' />
        </svg>
      </button>
    </div>
  )
}

export default SearchForm
