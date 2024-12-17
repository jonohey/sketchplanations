import { track } from '@vercel/analytics';
import coverImage from "images/big-ideas-little-pictures-cover-transparent.png";
import Image from "next/image";
import Link from "next/link";
import styles from "./BookBanner.module.css";

const BookBanner = () => {
  return (
    <Link 
      href="/big-ideas-little-pictures"
      className={styles.root}
      onClick={() => {
        track('Book-page-link', { location: 'sketch-banner' });
      }}
    >
      <div className={styles.content}>
        <div className={styles.imageWrapper}>
          <Image
            src={coverImage}
            alt="Big Ideas Little Pictures Book"
            className={styles.image}
            width={80}
            height={80}
          />
        </div>
        <div className={styles.text}>
          <div className="prose">
            <p className={styles.title}>Still need a gift? 🎄</p>
            <p className={styles.leadCopy}>Get the book. <span className="maxSm:hidden">135 sketches explaining the world</span></p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookBanner;
