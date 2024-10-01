import Link from 'next/link'
import style from "../../style/footer.module.css"

export const Footer = () => {
  return (
    
    <footer className={style.footer+" py-4 d-flex justify-content-between gap-2 align-items-center mx-sm-5 px-sm-5"}>
      <div className='d-flex gap-4'>
        <Link href="https://x.com/corepumpfun">
          <img src="/assets/icons/x.svg" alt="" />
        </Link>
        <Link href="https://t.me/cpumpfun" target='_blank'>
          <img src="/assets/icons/telegram.svg" alt="" />
        </Link>
      </div>
      <p className='text-end opacity-100'><span className='opacity-75'>All right reserved by</span> <Link href="https://x.com/corepumpfun" className='text-decoration-none' target='_blank' style={{color:"var(--main_color)"}}>@Cpump.fun</Link></p>
    </footer>
  )
}
