"use client"

import { useEffect, useState, useRef } from "react"
import s from "./postmedia.module.css"
import { Cancel01Icon, Comment01Icon, Download01Icon, Flag01Icon, Link01Icon, Share01Icon, ThumbsUpIcon } from "hugeicons-react"
import { enqueueSnackbar } from "notistack"
import { useRouter } from "next/navigation"

export default function PostMedia({ data, loadComment }) {
  if(!data.id) {
    return <></>
  }
  const router = useRouter()
  const videoRef = useRef()
  const mainContent = useRef()
  const controlClick = useRef()
  const holdingEventVideo = useRef()
  const [isPlaying, setPlaying] = useState(false)
  const [isLoadingVid, setLoadingVid] = useState(false)
  const [openComment, setOpenComment] = useState(false)
  const [listComment, setListComment] = useState({loading:true,list:[]})

  function TargetPushPlay() {
    try {

    } catch(e) {
      console.log(e)
    }
  }

  async function LoadContentComment() {
    const commentdata = await loadComment(data.id)
    console.log(commentdata)
    if(openComment) return;
    if(commentdata.error) {
      enqueueSnackbar(commentdata.error, { variant: "error" })
      setListComment({loading:false,list:[]})
    } else {
      setListComment({loading:false,list:commentdata.post})
    }
  }

  function handleControllerVideo() {
    if(videoRef.current.getBoundingClientRect().top < window.innerHeight && videoRef.current.getBoundingClientRect().bottom > 0) {
      if(!isPlaying) {
        document.querySelectorAll('video[shorting]').forEach(a => a.pause())
      }
      if(videoRef.current.paused) {
        setPlaying(true)
        videoRef.current.play()
        videoRef.current.muted = false
        TargetPushPlay()
      }
    } else {
      setPlaying(false)
      videoRef.current.pause()
    }
  }

  function MuteOrUnmuteVid() {
    if(videoRef.current.muted) {
      videoRef.current.muted = false
    } else {
      videoRef.current.muted = true
    }
  }

  async function PausePlayLayout(e) {
    if(e.target != mainContent.current) return
    if(videoRef.current.paused) {
      setPlaying(true)
      videoRef.current.play()
      videoRef.current.muted = false
      TargetPushPlay()
    } else {
      setPlaying(false)
      videoRef.current.pause()
    }
  }

  function HoldingEventVid(e) {
    if(e.type == "mousedown") {
      holdingEventVideo.current = setTimeout(PausePlayLayout, 200)
    } else {
      if(videoRef.current.paused) {
        setPlaying(true)
        videoRef.current.play()
        TargetPushPlay()
        videoRef.current.muted = false
      }
      if(holdingEventVideo.current) {
        clearTimeout(holdingEventVideo.current)
      }
    }
  }

  useEffect(() => {
    videoRef.current.load()
    window.addEventListener("scroll", handleControllerVideo)
    // controlClick.current.addEventListener("mouseup", HoldingEventVid)
    // controlClick.current.addEventListener("mousedown", HoldingEventVid)
    controlClick.current.addEventListener("click", PausePlayLayout)
    return () => {
      window.removeEventListener("scroll", handleControllerVideo)
      // controlClick.current.removeEventListener("mouseup", HoldingEventVid)
      // controlClick.current.removeEventListener("mousedown", HoldingEventVid)
      if(controlClick.current) {
        controlClick.current.removeEventListener("click", PausePlayLayout)
      }
    }
  }, [])
  return <div className={s.containerpost}>
    <div className={s.contentview}>
      <div className={s.content_info} ref={controlClick}>
        <div className={s.info_heading}></div>
        <div className={s.info_maincontent} ref={mainContent}>
          <div className={s.captioninfo}>
            <div className={s.info_carduser}>
              <img src={data.user.avatar} />
              <b>@{data.user.username}</b>
            </div>
            <p>{data.caption}</p>
          </div>
          <div className={s.moreoption}>
            <button onClick={() => {
              enqueueSnackbar("Tidak dapat melakukan upvote disini!", {variant:"error"})
            }}>
              <ThumbsUpIcon />
            </button>
            <p>{data.like}</p>
            <button onClick={() => {
              setOpenComment(!openComment)
              setTimeout(() => {
                console.log("Load...")
                LoadContentComment()
              }, 200)
              // enqueueSnackbar("Belum tersedia saat ini!", {variant:"error"})
            }}>
              <Comment01Icon />
            </button>
            <p>{data.comment}</p>
            <button onClick={() => {
              const a = document.createElement("a")
              a.innerText = "Download"
              a.href = data.video
              a.download = `${data.caption}.mp4`
              a.target = "_blank"
              document.body.appendChild(a)
              a.click()
              a.remove()
            }}>
              <Download01Icon />
            </button>
            <button onClick={() => {
              navigator.clipboard.writeText(`${location.origin}/${data.id}`)
              enqueueSnackbar("Berhasil menyalin link", { variant: "success" })
              // navigator.share({ text: `${location.origin}/${data.id}` })
            }}>
              {/* <Share01Icon /> */}
              <Link01Icon />
            </button>
          </div>
        </div>
      </div>
      <video poster={data.thumb} ref={videoRef} src={data.video} preload="true" loop muted shorting={data.id}/>
      <div className={s.commentpost} open={openComment?"!":""}>
        <div className={s.heading}>
          <b>Komentar</b>
          <button onClick={() => { setOpenComment(false) }}>
            <Cancel01Icon style={{width:18}}/>
          </button>
        </div>
        {listComment.list.map((a, i) => (
          <div className={s.cardcomment} key={i}>
            <div className={s.card_user}>
              <img src={a.user.avatar} /> <b>{a.user.username}</b>
            </div>
            <p>{a.text}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
}