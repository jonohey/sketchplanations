import ROModal from 'react-overlays/Modal'

const Modal = ({ children, onHide, ...props }) => {
  const renderBackdrop = (props) => <div className='backdrop' {...props} />

  return (
    <>
      <ROModal {...props} className='sp-modal' renderBackdrop={renderBackdrop} onBackdropClick={onHide}>
        <div className='root'>
          <div className='main'>{children}</div>
          <button className='close' onClick={onHide}>
            ✕
          </button>
        </div>
      </ROModal>
      <style jsx global>{`
        .backdrop {
          @apply fixed top-0 left-0 w-full h-full;
          z-index: 1040;
          background-color: rgba(255, 255, 255, 0.38);
          backdrop-filter: blur(10px);
        }

        @screen dark {
          .backdrop {
            background-color: rgba(53, 54, 58, 0.38);
          }
        }
      `}</style>
      <style jsx>{`
        .root {
          @apply fixed top-1/2 left-1/2 rounded-md bg-bg overflow-hidden;
          width: 90vw;
          max-width: 36rem;
          max-height: 90vh;
          z-index: 1040;
          box-shadow: 0 1px 2.7px rgba(0, 0, 0, 0.045), 0 2.6px 7.5px rgba(0, 0, 0, 0.065),
            0 6.3px 18.1px rgba(0, 0, 0, 0.085), 0 21px 60px rgba(0, 0, 0, 0.13);
          transform: translate(-50%, -50%);
        }

        .main {
          @apply h-full overflow-auto;
          max-height: 90vh;
        }

        .close {
          @apply absolute top-0 right-0 z-10 flex items-center justify-center text-lg;
          color: #ccc;
          width: 45px;
          height: 45px;
        }
      `}</style>
    </>
  )
}

export default Modal
