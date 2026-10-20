import Image from "next/image";

import styles from "./Book3D.module.css";

// A square book rendered with CSS 3D transforms: cover on the front, spine on
// the left and page edges on the right. It turns slightly towards the viewer
// on hover/focus (see Book3D.module.css). Size is driven by --book-w / --book-t.
// `small` is for cards and banners: a thumbnail-sized cover that loads lazily
// and skips the spine lettering, which would be unreadable at that size.
const Book3D = ({
	cover,
	alt,
	spineTitle,
	spineAuthor,
	small = false,
	priority = !small,
}) => (
	<div className={small ? `${styles.root} ${styles.small}` : styles.root}>
		<div className={styles.body}>
			<div className={styles.front}>
				<Image
					src={cover}
					alt={alt}
					priority={priority}
					placeholder="blur"
					sizes={small ? "96px" : "(max-width: 768px) 280px, 340px"}
					quality={small ? 75 : 85}
					className={styles.cover}
				/>
				<div className={styles.sheen} />
			</div>
			<div className={styles.spine} aria-hidden="true">
				{small ? null : (
					<>
						<span className={styles.spineTitle}>{spineTitle}</span>
						<span>{spineAuthor}</span>
					</>
				)}
			</div>
			<div className={styles.pages} />
			<div className={styles.back} />
		</div>
		<div className={styles.shadow} aria-hidden="true" />
	</div>
);

export default Book3D;
