import { default as NextLink } from 'next/link'
import { useRouter } from 'next/router'
import { cloneElement } from 'react'

const Link = ({ href, children }) => {
  const router = useRouter()

  let className = children.props.className || ''
  if (router.pathname === href) {
    className = `${className} selected`
  }

  return <NextLink href={href}>{cloneElement(children, { className })}</NextLink>
}

export default Link
