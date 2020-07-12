import { useRouter } from 'next/router'

const Post = () => {
  const router = useRouter()
  const { uid } = router.query

  return <pre>{uid}</pre>
}

export default Post
