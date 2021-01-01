import React from 'react'
import { Modal as ROModal } from 'react-overlays'

const Modal = ({ children, onHide, ...props }) => {
  return (
    <>
      <ROModal {...props} className='sp-modal'>
        <div className='root'>
          <div className='scroll-container'>{children}</div>
          <button className='close' onClick={onHide}>
            ✕
          </button>
        </div>
      </ROModal>
      <style jsx>{`
        :global(.sp-modal > div:first-child) {
          position: fixed;
          z-index: 1040;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: rgba(36, 32, 56, 0.38);
          backdrop-filter: blur(5px);
        }
        .root {
          position: fixed;
          width: 90vw;
          max-width: 36rem;
          max-height: 90vh;
          z-index: 1040;
          top: 50%;
          left: 50%;
          background-color: #fff;
          box-shadow: 0 1px 2.7px rgba(0, 0, 0, 0.045), 0 2.6px 7.5px rgba(0, 0, 0, 0.065),
            0 6.3px 18.1px rgba(0, 0, 0, 0.085), 0 21px 60px rgba(0, 0, 0, 0.13);
          transform: translate(-50%, -50%);
          @apply rounded-md;
          outline: none;
        }

        .scroll-container {
          overflow: auto;
          max-height: 100%;
          @apply rounded-md;
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
