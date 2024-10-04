import style from "@/src/app/page.module.css"
import Link from "next/link"

export const New_token_card = () => {
  return (
    <div className={style.nt_card+" d-flex justify-content-between align-items-center"}>
        <div className="d-flex gap-2 align-items-center">
            <img src="/assets/demo1-hero.png" alt="" />
            <div>
                <h3>Lorem Ipusem</h3>
                <p className="mb-0">by Devmoa</p>
            </div>
        </div>
        <Link href="#" className="d-flex justify-content-center align-items-center">
            <img src="/assets/icons/right-top-arrow.svg" alt="" />
        </Link>
    </div>
  )
}
