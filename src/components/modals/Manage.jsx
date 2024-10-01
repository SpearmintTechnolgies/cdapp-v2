import style from '@/src/style/modal.module.css'

export const Manage = ({ setPop }) => {
  function handleOutter(e) {
    let flage = [...e.target.classList].includes("manageOutter")
    if (flage) {
      setPop("")
    }
  }
  return (
    <div className={style.manage + " d-flex justify-content-center align-items-center manageOutter"} onClick={handleOutter}>
      <div>
        <h1>This is all we could manage</h1>
        <div className='d-flex justify-content-center mt-4 mb-5'>
          <img src="/assets/manage.svg" alt="" />
        </div>
        <div className={style.text_div}>
          <p className='text-center opacity-75'>Our Amazing dev team couldn't bring this feature today ( blame the coffee ☕ Break ) </p>
          <p className='text-center opacity-75'>But don’t worry, it'll be ready by Tuesday around 2PM to 4PM UTC! Thanks for waiting! 😅</p>
        </div>
        <button onClick={() => setPop("")} className='btn1 py-2 w-100 px-3 mt-3'>Let’s wait for the Good!</button>
      </div>
    </div>
  )
}
