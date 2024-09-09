import { X } from "lucide-react";
import {
	Modal as AriaModal,
	Dialog,
	ModalOverlay,
} from "react-aria-components";

import styles from "./Modal.module.css";

const Modal = ({ onClose, children, ...props }) => {
	return (
		<ModalOverlay className={styles.backdrop} isDismissable {...props}>
			<AriaModal className={styles.modal} onClick={onClose}>
				<Dialog>
					<div className={styles.main}>{children}</div>
					<button type="button" className={styles.close} onClick={onClose}>
						<X />
					</button>
				</Dialog>
			</AriaModal>
		</ModalOverlay>
	);
};

export default Modal;
