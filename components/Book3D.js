import Image from "next/image";
import styles from "./Book3D.module.css";

// A square book rendered with CSS 3D transforms: cover on the front, spine on
// the left and page edges on the right. It turns slightly towards the viewer
// on hover/focus (see Book3D.module.css). Size is driven by --book-w / --book-t.
const Book3D = ({ cover, alt, spineTitle, spineAuthor }) => (
	<div className={styles.root}>
		<div className={styles.body}>
			<div className={styles.front}>
				<Image
					src={cover}
					alt={alt}
					priority
					placeholder="blur"
					sizes="(max-width: 768px) 280px, 340px"
					quality={85}
					className={styles.cover}
				/>
				<div className={styles.sheen} />
			</div>
			<div className={styles.spine} aria-hidden="true">
				<span className={styles.spineTitle}>{spineTitle}</span>
				<span>{spineAuthor}</span>
			</div>
			<div className={styles.pages} />
			<div className={styles.back} />
		</div>
		<div className={styles.shadow} aria-hidden="true" />
	</div>
);

export default Book3D;
