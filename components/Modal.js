import ROModal from 'react-overlays/Modal'

import styles from './Modal.module.css'

const Modal = ({ children, onHide, ...props }) => {
  const renderBackdrop = (props) => <div className={styles.backdrop} {...props} />

  return (
    <ROModal {...props} className={styles['sp-modal']} renderBackdrop={renderBackdrop} onBackdropClick={onHide}>
      <div className={styles.root}>
        <div className={styles.main}>{children}</div>
        <button className={styles.close} onClick={onHide}>
          ✕
        </button>
      </div>
    </ROModal>
  )
}

export default Modal
