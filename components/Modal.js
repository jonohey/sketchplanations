import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import {
	Modal as AriaModal,
	Dialog,
	ModalOverlay,
} from "react-aria-components";

import { X } from "lucide-react";
import styles from "./Modal.module.css";
const MotionModal = motion.create(AriaModal);

const Modal = ({ isOpen: isOpenProp, onClose, children, ...props }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isOpening, setIsOpening] = useState(false);
	const [isClosing, setIsClosing] = useState(false);

	const open = useCallback(() => {
		setIsOpening(true);
		setIsOpen(true);
	}, []);

	const close = useCallback(() => {
		if (isOpening || !isOpen) return;

		setIsClosing(true);
		setIsOpen(false);
		onClose?.();
	}, [isOpen, isOpening, onClose]);

	useEffect(() => {
		if (!isOpenProp) return;

		open();
	}, [isOpenProp, open]);

	return (
		<ModalOverlay
			// className={styles.backdrop}
			{...props}
			isOpen={isOpen || isOpening || isClosing}
			isDismissable={true}
			onOpenChange={close}
		>
			<motion.div
				className="fixed inset-0 z-10 bg-overlay"
				initial={{
					opacity: 0,
					backdropFilter: "blur(0px)",
					WebkitBackdropFilter: "blur(0px)",
				}}
				animate={{
					opacity: isOpen ? 1 : 0,
					backdropFilter: isOpen ? "blur(8px)" : "blur(0px)",
					WebkitBackdropFilter: isOpen ? "blur(8px)" : "blur(0px)",
				}}
				transition={{
					duration: 0.2,
				}}
			/>
			<MotionModal
				className="fixed inset-0 z-20 w-full h-[var(--visual-viewport-height)] flex items-center justify-center pointer-events-none"
				initial={{
					scale: 0.9,
					opacity: 0,
					y: 100,
				}}
				onAnimationComplete={() => {
					if (isOpen) {
						setIsOpening(false);
					} else {
						setIsClosing(false);
					}
				}}
				animate={
					isOpen
						? {
								scale: 1,
								opacity: 1,
								y: 0,
							}
						: {
								scale: 0.9,
								opacity: 0,
								y: 100,
							}
				}
				transition={{
					type: "spring",
					damping: 10,
					stiffness: 200,
					mass: 0.1,
				}}
			>
				<Dialog className="relative w-[calc(100%-2rem)] max-w-xl max-h-full bg-bg border border-border rounded pointer-events-auto">
					<button type="button" className={styles.close} onClick={close}>
						Done
						<X />
					</button>
					<div className="w-full  max-h-[calc(var(--visual-viewport-height)-4rem)] overflow-auto py-8 px-10">
						{children}
					</div>
				</Dialog>
			</MotionModal>
		</ModalOverlay>
	);
};

export default Modal;
