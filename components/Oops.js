import styles from './Oops.module.css'
import Image from 'next/image'

import oopsImage from '../public/oops.png'

const loader = ({ src }) => src

const Oops = ({ children }) => {
  return (
    <div className={styles.main}>
      <div className={styles.image}>
        <Image src={oopsImage} alt='Error' width={640} height={542.5} loader={loader} />
      </div>
      {children}
      <p>
        Maybe <a href='/explore'>search Sketchplanations</a> or try looking in <a href='/tags'>tags</a>?
      </p>
      <p>
        Please let me know if a link is broken so I can fix it for others. I’m at{' '}
        <a href='mailto:jono.hey@gmail.com?subject=Broken link to fix!'>jono.hey@gmail.com</a>
      </p>
    </div>
  )
}

export default Oops
