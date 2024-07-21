"use client"

import PostMedia from "~/layout/postmedia"
import useScrollSnap from "react-use-scroll-snap"
import { useEffect, useRef, useState } from "react"
import { enqueueSnackbar } from "notistack"

export default function ContainContent({ data, loadNew, loadComment }) {
  const scrollContain = useRef()
  const [dataPost, setDataPost] = useState(data.post)
  const [loadingNew, setLoadingNew] = useState(false)
  const scrollSnap = useScrollSnap({
    ref: scrollContain,
    duration: 10,
    delay: 0
  })
  async function InserPostNew() {
    setLoadingNew(true)
    const a = await loadNew()
    let PostData = dataPost
    let newPost = null
    if(a.error) {
      enqueueSnackbar(a.error, { variant: "error" })
      enqueueSnackbar("Try again...", { variant: "warning" })

      const b = await loadNew()
      if(b.error) {
        return enqueueSnackbar(b.error, { variant: "error" })
      }
      newPost = b.post
      return setLoadingNew(false)
    }
    newPost = a.post

    const insert = [
      ...PostData,
      ...newPost
    ]
    setLoadingNew(false)
    return setDataPost(insert)
  }

  useEffect(() => {
    document.querySelector('video').autoplay = true
  }, [])

  return <div className="responsescroll" ref={scrollContain}>
    <div className="info-first-view" onClick={() => {
      document.querySelector('.info-first-view').remove()
      setTimeout(() => {
        document.querySelector('video').play()
        document.querySelector('video').muted = false
      }, 200)
    }}>
      <div className="box">
        <h3>Klik utk interaksi element</h3>
        <p>Click halaman ini sembarang saja untuk memulai berjalannya aplikasi, jika video tidak dimulai atau terhenti, coba klik ulang pada video</p>
      </div>
    </div>
    {dataPost.map((a, i) => (
      <PostMedia data={a} key={i} loadComment={loadComment}/>
    ))}
    {!loadingNew? <div className="clicked" onClick={InserPostNew}>Click to load</div> : ""}
  </div>
}