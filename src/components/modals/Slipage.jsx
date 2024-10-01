import { useState } from 'react';
import style from '../../style/modal.module.css'

export const Slipage = ({close,slippage,setSlippage}) => {
    function handleOutter(e){
        var flage = [...e.target.classList].includes("slipageOutter");
        if(flage){
            close()
        }
    }
    const [errorText,setErrortext] = useState(null)
    const handleSippage = (e) => {
        setErrortext(null)
        const slip = e.target.value; 
        // setSlippage(slip);
        if(slip > 15){
            setErrortext("Max 15% is allowed");
            setSlippage(15);
            return;
        }
        setSlippage(slip);

    }

    return (
        <div className={style.slipage + " d-flex justify-content-center align-items-center slipageOutter"} onClick={handleOutter}>
            <div className={style.slipage_card}>
                <h2>Swap Config</h2>
                <div>
                    <label htmlFor="" className="mb-1 fw-bold">Set max. slippage (%)</label>
                    <input type="number" max={15} value={slippage} onChange={(e) => handleSippage(e)} className="w-100" defaultValue="5" />
                    <p>Modify the max slippages for your trades. Default: 5%</p>
                </div>
                {/* <div className="form-check mt-2 form-switch d-flex justify-content-between form-check-reverse">
                    <label className="form-check-label fw-bold" for="flexSwitchCheckReverse">Enable MEV Protection:</label>
                    <input className="form-check-input" type="checkbox" id="flexSwitchCheckReverse" />
                </div> */}
                {/* condition based */}
                {/* <p >After MEV protection is turned on, front-running and sandwich attacks will be effectively prevented. (Metamask wallet only)</p> */}
                {/* <label htmlFor="">Priority fee</label>
                <div className={style.inputfield + ' d-flex'}>
                    <input type="number" placeholder="0.0" />
                    <button className='d-flex gap-1 border-0 bg-white '>
                        <img src="/assets/cube.svg" alt="" />
                        Core
                    </button>
                </div> */}
                {/* condition based */}
                {/* <p className="text-danger">warning: we recommend setting a priority fee greater than 0.003 SOL or your transactions are unlikely to get confirmed.</p>
                <p>A higher priority fee will make your transactions confirm faster. This is the transaction fee that you pay to the solana network on each trade.</p> */}
                {
                    errorText &&
                    <p className="text-danger">{errorText}</p>
                }
                <button className="btn1 w-100 py-2" onClick={close}>Save</button>
            </div>
        </div>
    )
}
