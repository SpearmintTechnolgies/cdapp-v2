import style from '@/src/app/page.module.css'
import { useRef, useState } from 'react'

export const Pagination = ({stor, page}) => {
    const [t_page, setTpage] = useState(Math.ceil(stor.length/3))
    const currentIndex = useRef(0)
    const handleNext = () => {
        let c_active = document.querySelector(".active-page")
        c_active?.classList.remove("active-page");
        let btnlist = document.querySelectorAll(".page-btn")
        console.warn(currentIndex.current)
        currentIndex.current = currentIndex.current + 1;
        btnlist[currentIndex.current].classList.add("active-page")
    }
    const handlePrev = () => {
        if (currentIndex.current <= 0) return;
        console.warn(currentIndex.current)
        let c_active = document.querySelector(".active-page")
        c_active?.classList.remove("active-page");
        let btnlist = document.querySelectorAll(".page-btn")
        currentIndex.current = currentIndex.current - 1;
        btnlist[currentIndex.current].classList.add("active-page")
    }
    const handlebtnClick = (e) => {
        let c_active = document.querySelector(".active-page")
        c_active?.classList.remove("active-page");
        console.warn(e.target.value)
        currentIndex.current = Number(e.target.value);
        e.target.classList.add("active-page")
    }

    return (
        <div className={style.pagi_parent + "  d-flex justify-content-center gap-2 mt-3"}>
            <button onClick={handlePrev} className={style.pre_btn + " fs-3 d-flex justify-content-center align-items-center"}><i class="bi bi-arrow-left-short"></i></button>
            <div className='d-flex gap-2'>
                <button value="0" onClick={handlebtnClick} className='page-btn active-page'>1</button>
                <span>...</span>
                <div className={style.track}>
                    <div className='d-flex gap-2'>
                        {/* {t_page.} */}
                        <button className='page-btn' value="1" onClick={handlebtnClick}>3</button>
                        <button className='page-btn' value="2" onClick={handlebtnClick}>4</button>
                        <button className='page-btn' value="3" onClick={handlebtnClick}>5</button>
                    </div>
                </div>
                <span>...</span>
                <button onClick={handlebtnClick} value="4" className='page-btn'>15</button>
            </div>
            <button onClick={handleNext}  className={style.next_btn + " fs-3 d-flex justify-content-center align-items-center"}><i class="bi bi-arrow-right-short"></i></button>
        </div>
    )
}
