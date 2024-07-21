import ContainContent from "~/layout/containcontent"
import { GetRandomPost, GetPostView, ViewComment } from "~/lib/lahelu"

async function NewLoadPost() {
  "use server"
  try {
    const fetch = await GetRandomPost()
    return fetch
  } catch(err) {
    return { error: err.message }
  }
}

async function LoadCommentPost(id) {
  "use server"
  try {
    const fetch = await ViewComment(id)
    return fetch
  } catch(err) {
    return { error: err.message }
  }
}

export default async function RedirectlyContent({ params }) {
  const listPost = await GetPostView(params.slug)

  return <div>
    <ContainContent data={listPost} loadNew={NewLoadPost} loadComment={LoadCommentPost}/>
  </div>
}