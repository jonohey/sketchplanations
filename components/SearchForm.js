import { isPresent } from 'helpers'

const SearchForm = ({ value, isBusy = false, onChange = () => {}, onReset = () => {} }) => {
  return (
    <>
      <div className='root'>
        <input
          className='input'
          type='text'
          placeholder='Type to search…'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus={true}
        />
        {isBusy && (
          <div className='loading-indicator'>
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
              <path d='M0 11c.511-6.158 5.685-11 12-11s11.489 4.842 12 11h-2.009c-.506-5.046-4.793-9-9.991-9s-9.485 3.954-9.991 9h-2.009zm21.991 2c-.506 5.046-4.793 9-9.991 9s-9.485-3.954-9.991-9h-2.009c.511 6.158 5.685 11 12 11s11.489-4.842 12-11h-2.009z' />
            </svg>
          </div>
        )}
        <button onClick={onReset} className={`reset-button ${isPresent(value) && 'is-active'}`} type='button'>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
            <path d='M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z' />
          </svg>
        </button>
      </div>
      <style jsx>
        {`
          .root {
            @apply relative mx-auto px-4 mb-6 flex flex-row;
            max-width: 28rem;
          }

          @screen sm {
            .root {
              @apply px-0;
            }
          }

          .input {
            @apply block py-2 px-4 w-full bg-inputBg border border-inputBorder border-r-0 outline-none flex-grow rounded-lg rounded-r-none;
          }

          @screen sm {
            .input {
              @apply py-3 px-6 text-lg rounded-full rounded-r-none;
            }
          }

          .input:focus,
          .input:focus ~ .reset-button {
            @apply border-blue;
          }

          .reset-button {
            @apply px-4 bg-inputBg border border-inputBorder border-l-0 rounded-lg rounded-l-none pointer-events-none;
          }

          @screen sm {
            .reset-button {
              @apply px-6 rounded-full rounded-l-none;
            }
          }

          .reset-button.is-active {
            @apply pointer-events-auto;
            color: #777;
          }

          .reset-button svg {
            width: 14px;
            height: 14px;
            fill: currentColor;
            opacity: 0;
            transition: opacity 0.2s;
          }

          .reset-button.is-active svg {
            opacity: 1;
          }

          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          .loading-indicator {
            @apply absolute top-0 right-12 h-full flex items-center;
          }

          @screen sm {
            .loading-indicator {
              @apply right-14;
            }
          }

          .loading-indicator svg {
            width: 18px;
            height: 18px;
            fill: #aaa;
            animation: spin 1s linear infinite;
          }
        `}
      </style>
    </>
  )
}

export default SearchForm
