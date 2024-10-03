import style from '@/src/app/page.module.css'

export const Top_Corousel_Card = () => {
  return (
    <div className={style.tc_card+" d-flex align-items-center gap-2"}>
        <div className={`${style.left} d-flex align-items-center gap-2`}>
          <p>0x16...a81119</p>
          <p className={style.sold}>Sold</p>
          <p>0.12 Core of</p>
        </div>
        <div className={`${style.right} d-flex align-items-center gap-2`}>
          <img src="/assets/demo1-hero.png" alt="img" />
          <p>FEED EVERY CATS</p>
        </div>
    </div>
  )
}
