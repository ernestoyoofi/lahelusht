const FetchingAPI = require("./fetching")

const lahelumedia = "https://cache.lahelu.com/"
const getcommentpost = "https://lahelu.com/api/comment/get-post-comments?postID={POSTID}&page=0&newest=false"
const getpostinfo = "https://lahelu.com/api/post/get?postID={POSTID}"
const getbatchpost = "https://lahelu.com/api/post/get-posts?feed=0&page={RANDOM}"
// const getbatchpost = "https://lahelu.com/api/post/get-posts?feed=2&page={RANDOM}" // For Thrending

function ContainLahelu(postInfo) {
  if(postInfo?.commentID) {
    return {
      id: postInfo.commentID,
      user: {
        id: postInfo.userID,
        username: postInfo.userUsername,
        avatar: postInfo.userAvatar?.slice(0, 7) == "avatar-"? `${lahelumedia}${postInfo.userAvatar}` : postInfo.userAvatar
      },
      text: postInfo.text,
      like: postInfo.totalLikes,
      timestamp: postInfo.createTime
    }
  }
  if(!postInfo?.postID) {
    console.log(postInfo)
    return {}
  }
  return {
    id: postInfo.postID,
    user: {
      id: postInfo.userID,
      username: postInfo.userUsername,
      avatar: postInfo.userAvatar?.slice(0, 7) == "avatar-"? `${lahelumedia}${postInfo.userAvatar}` : postInfo.userAvatar
    },
    video: `${lahelumedia}${postInfo.media}`,
    comps: {
      width: postInfo.mediaWidth,
      height: postInfo.mediaHeight
    },
    thumb: `${lahelumedia}${postInfo.mediaThumbnail}`,
    caption: postInfo.title,
    sensitive: postInfo.sensitive,
    comment: postInfo.totalComments,
    like: postInfo.totalUpvotes,
    timestamp: postInfo.createTime
  }
}

async function GetRandomPost() {
  let randomPage = []
  async function FetchingBatch() {
    const randomPg = Math.floor(Math.random() * 9000)
    const urlPosts = getbatchpost.replace("{RANDOM}", randomPg)
    randomPage.push(randomPg)
    const fetched = await FetchingAPI(urlPosts)
    if(fetched.error) {
      return { error: fetched.message || String(fetched.data) }
    }
    if(!fetched?.data?.postInfos) {
      return { error: `E: ${JSON.stringify(fetched.data).slice(0, 1200)}` }
    }
    return {
      result: fetched.data.postInfos.filter(a => a.mediaType == 1)
    }
  }
  let dataView = []
  for(let a in [...Array(5)]) {
    const data = await FetchingBatch()
    if(data.error) {
      return { error: data.error }
    }
    data.result.forEach((a) => { dataView.push(a) })
  }
  return {
    randomPage,
    post: dataView.slice(0, 10).map(a => ContainLahelu(a))
  }
}

async function GetPostView(id) {
  const fetched = await FetchingAPI(getpostinfo.replace("{POSTID}", id))
  const recommendMore = await GetRandomPost()
  if(fetched.error || fetched.data.commentInfos) {
    return { error: fetched.message || `E: ${JSON.stringify(fetched.data).slice(0, 1200)}` }
  }
  if(recommendMore.error) {
    return { error: recommendMore }
  }
  return {
    randomPage: recommendMore.randomPage,
    post: [
      ContainLahelu(fetched.data.postInfo),
      ...recommendMore.post
    ],
  }
}

async function ViewComment(postId) {
  const fetched = await FetchingAPI(getcommentpost.replace("{POSTID}", postId))
  if(fetched.error || !fetched.data.commentInfos) {
    return { error: fetched.message || `E: ${JSON.stringify(fetched.data).slice(0, 1200)}` }
  }
  return {
    post: fetched.data.commentInfos.map(a => ContainLahelu(a))
  }
}

module.exports = {
  GetRandomPost,
  GetPostView,
  ViewComment
}