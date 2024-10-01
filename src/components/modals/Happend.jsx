import style from '@/src/style/modal.module.css'


export const Happend = ({setPop}) => {
    function handleOutter(e){
        let flage = [...e.target.classList].includes("happendOutter")
        if(flage){
            setPop("")
        }
    }
  return (
    
    <div className={style.manage+" d-flex justify-content-center align-items-center happendOutter"} onClick={handleOutter}>
        <div>
            <h1 className='text-center'>This could never be <br /> Happened!</h1>
            <p className='text-center opacity-75  mt-4'>Meanwhile our Devs</p>
            <div className={style.imgdiv+' d-flex justify-content-center mb-5'}>
                <img src="/assets/group_person.png" alt="" />
            </div>
            <div className={style.text_div+" mt-5"}>
                <p className='text-center opacity-75'>But don’t worry, it'll be ready by Tuesday around 2PM to 4PM UTC! Thanks for waiting! 😅</p> 
            </div>
            <button onClick={()=>setPop("")} className='btn1 py-2 w-100 px-3 mt-3'>Let’s wait for the Good!</button>
        </div>
    </div>
    )
}
