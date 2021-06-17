const SortButton = ({ children, active, ...props }) => (
  <>
    <button {...props}>{children}</button>
    <style jsx>{`
      button {
        @apply relative py-1 px-4 text-sm;
        color: ${active ? '#fff' : 'inherit'};
        background-color: ${active ? '#1253B5' : '#fff'};
      }
    `}</style>
  </>
)

const ButtonGroup = ({ label, value, options, onChange = () => {} }) => {
  return (
    <>
      <div className='root'>
        {label && <div className='label'>{label}</div>}
        <div className='sort-buttons'>
          {options.map(({ label, value: optionValue }, index) => (
            <SortButton key={index} active={value === optionValue} type='button' onClick={() => onChange(optionValue)}>
              {label}
            </SortButton>
          ))}
        </div>
      </div>
      <style jsx>{`
        .root {
          @apply flex items-center;
        }

        .label {
          @apply mr-4 text-sm font-semibold;
        }

        .sort-buttons {
          @apply flex items-center shadow rounded-lg;
        }

        .sort-buttons :global(> *:first-child) {
          @apply rounded-l-lg;
        }

        .sort-buttons :global(> *:last-child) {
          @apply rounded-r-lg;
        }

        .sort-buttons :global(> * + *) {
          @apply border-l;
        }
      `}</style>
    </>
  )
}

export default ButtonGroup
