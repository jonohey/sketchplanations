import { isPresent } from 'helpers'

const SearchForm = ({ value, isBusy = false, onChange = () => {}, onReset = () => {} }) => {
  return (
    <>
      <div className='root'>
        <input
          className='query-input'
          type='text'
          placeholder='Type to search…'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus={true}
        />
        <button onClick={onReset} className={`submit-button ${isPresent(value) && 'is-active'}`} type='button'>
          {isBusy ? (
            <svg className='search-loading-icon' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              ></path>
            </svg>
          ) : (
            <svg className='clear-icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
              <path d='M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z' />
            </svg>
          )}
        </button>
      </div>
      <style jsx>
        {`
          .root {
            @apply mx-auto px-4 mb-6 flex flex-row;
            max-width: 28rem;
          }

          @screen sm {
            .root {
              @apply px-0;
            }
          }

          .query-input {
            @apply block py-2 px-4 w-full bg-white border border-r-0 outline-none flex-grow rounded-lg rounded-r-none;
          }

          @screen sm {
            .query-input {
              @apply py-3 px-6 text-lg rounded-full rounded-r-none;
            }
          }

          .query-input:focus,
          .query-input:focus ~ .submit-button {
            @apply border-blue;
          }

          .submit-button {
            @apply px-4 text-black border border-l-0 rounded-lg rounded-l-none;
          }

          @screen sm {
            .submit-button {
              @apply px-6 rounded-full rounded-l-none;
            }
          }

          .query-input:focus ~ .submit-button.is-active {
            @apply text-blue;
          }

          .submit-button svg {
            width: 1rem;
            height: auto;
          }

          .clear-icon {
            fill: currentColor;
            opacity: 0;
            transition: opacity 0.2s;
          }

          .query-input:focus ~ .submit-button.is-active > .clear-icon {
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

          .search-loading-icon {
            @apply text-blue;
            animation: spin 1s linear infinite;
          }
        `}
      </style>
    </>
  )
}

export default SearchForm
