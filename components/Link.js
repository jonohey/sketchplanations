import { default as NextLink } from 'next/link'

const Link = ({ href, children, className }) => {
  return (
    <NextLink href={href} className={className}>
      {children}
    </NextLink>
  )
}

export default Link
