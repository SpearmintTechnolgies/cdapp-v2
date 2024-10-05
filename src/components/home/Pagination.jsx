import style from '@/src/app/page.module.css'
import { useEffect, useRef, useState } from 'react'

export const Pagination = ({ stor, setPage }) => {
    const [t_page, setTpage] = useState(Math.ceil(stor.length / 3))
    const currentIndex = useRef(0)

    function handledot() {
        if (currentIndex.current < 3) {
            document.querySelector(".left_dot").style.display = "none"
        } else {
            document.querySelector(".left_dot").style.display = "block"
        }
        if (currentIndex.current >= t_page-3) {
            document.querySelector(".right_dot").style.display = "none"
        } else {
            document.querySelector(".right_dot").style.display = "block"
        }
        if (currentIndex.current > t_page-3) return
        let track = document.querySelector(".button_track>div");
        track.style.transform = `translateX(${(currentIndex.current - 2) * 38 <= 0 ? 0 : -(currentIndex.current - 2) * 38}px)`
        console.warn((currentIndex.current - 2) * 38);
    }

    const handleNext = () => {
        if (currentIndex.current >= t_page-1) return;
        let c_active = document.querySelector(".active-page")
        c_active?.classList.remove("active-page");
        let btnlist = document.querySelectorAll(".page-btn")
        console.warn(currentIndex.current)
        currentIndex.current = currentIndex.current + 1;
        btnlist[currentIndex.current].classList.add("active-page")

        let start = currentIndex.current*3;
        let end = (currentIndex.current*3)+3>stor.length? stor.length:(currentIndex.current*3)+3;
        console.warn(end>stor.length)
        setPage(stor.slice(start, end))
        handledot()
    }
    const handlePrev = () => {
        if (currentIndex.current <= 0) return;
        console.warn(currentIndex.current)
        let c_active = document.querySelector(".active-page")
        c_active?.classList.remove("active-page");
        let btnlist = document.querySelectorAll(".page-btn")
        currentIndex.current = currentIndex.current - 1;
        btnlist[currentIndex.current].classList.add("active-page")

        let start = currentIndex.current*3;
        let end = (currentIndex.current*3)+3>stor.length? stor.length:(currentIndex.current*3)+3;
        console.warn(end>stor.length)
        setPage(stor.slice(start, end))
        handledot()
    }
    const handlebtnClick = (e) => {
        let c_active = document.querySelector(".active-page")
        c_active?.classList.remove("active-page");
        currentIndex.current = Number(e.target.value);
        e.target.classList.add("active-page")

        let start = currentIndex.current*3;
        let end = (currentIndex.current*3)+3>stor.length? stor.length:(currentIndex.current*3)+3;
        console.warn(end>stor.length)
        setPage(stor.slice(start, end))

        handledot()

    }
    useEffect(()=>{
        if(stor.length>0){
            setTpage(Math.ceil(stor.length / 3))
            setPage(stor.slice(0,3))
        }
    },[stor])

    return (
        <div className={style.pagi_parent + "  d-flex justify-content-center gap-2 mt-3"}>
            <button onClick={handlePrev} className={style.pre_btn + " fs-3 d-flex justify-content-center align-items-center"}><i class="bi bi-arrow-left-short"></i></button>
            <div className='d-flex gap-2'>
                <button value="0" onClick={handlebtnClick} className='page-btn active-page'>1</button>
                {t_page > 2 &&
                    <>
                        <span className='left_dot' style={{display:"none"}}>...</span>
                        <div className={style.track + " button_track"}>
                            <div className='d-flex gap-2'>
                                {
                                    Array.from({ length: t_page-2 }, (_, index) => (
                                        <button className='page-btn' value={index + 1} onClick={handlebtnClick} key={index}>{index + 2}</button>
                                    ))
                                }
                            </div>
                        </div>
                        <span className='right_dot'>...</span>
                    </>
                }
                <button onClick={handlebtnClick} value={t_page-1} className='page-btn'>{t_page}</button>
            </div>
            <button onClick={handleNext} className={style.next_btn + " fs-3 d-flex justify-content-center align-items-center"}><i class="bi bi-arrow-right-short"></i></button>
        </div>
    )
}
