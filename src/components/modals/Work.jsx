import { useEffect } from 'react'
import style from '../../style/modal.module.css'

export const Work = ({ hide, setModal }) => {

    function closeOutside(e) {
        var flage = [...e.target.classList].includes("outwork_modal");
        if (flage) {
            hide()
        }
    }

    useEffect(() => {
        import("bootstrap/dist/js/bootstrap")
    }, [])
    return (
        <div className={style.work + " d-flex justify-content-center align-items-start outwork_modal"} onClick={closeOutside}>
            <div className='my-3'>
                <h1 className='text-center mb-4'>How it works</h1>
                <p className='text-center mb-5'>Cpump prevents rugs by making sure that all created tokens are safe. Each coin on Cpump is a fair-launch with no presale and no team allocation.</p>
                <div className='d-flex gap-3'>
                    <p>Step 1</p>
                    <p>Pick a coin that you like.</p>
                </div>
                <div className='d-flex gap-3'>
                    <p>Step 2</p>
                    <p>Buy the coin on the bonding curve.</p>
                </div>
                <div className='d-flex gap-3'>
                    <p>Step 3</p>
                    <p>Sell at any time to lock in your profits or losses.</p>
                </div>
                <div className='d-flex gap-3'>
                    <p>Step 4</p>
                    <p>When enough people buy on the bonding curve it reaches a market cap of $23k.</p>
                </div>
                <div className='d-flex gap-3'>
                    <p>Step 5</p>
                    <p>$8k of liquidity is then deposited in Archerswap and locked with team</p>
                </div>
                <div class="accordion" id="accordionExample">
                    <div class="accordion-item">
                        <button class="accordion-button bg-transparent collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                            Create Token
                        </button>
                        <div id="collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                                <p className='opacity-75 text-wrap'>1. Choose a name, symbol (ticker), and upload an image.</p>
                                <p className='fw-normal'>2. Token is now created and tradable on the bonding curve.</p>
                            </div>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <button class="accordion-button bg-transparent collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            Trade Token
                        </button>
                        <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                                <p className='fw-normal text-wrap'>Buy and sell token on the bonding curve.</p>
                            </div>
                        </div>
                    </div>
                    <div class="accordion-item" >
                        <button class="accordion-button bg-transparent collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                            Archerswap Listing
                        </button>
                        <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                                <p className='opacity-75 text-wrap'>1. Once bonding curve reaches 100% ( approximately 8000 Core), the seeding process will begin.</p>
                                <p className='fw-normal'>2. 100% of the liquidity is then deposited in Archerswap and Locked.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='d-flex gap-5 mt-4'>
                    <button className='btn2 py-2 w-50' onClick={hide}>Done</button>
                    <button className='btn1 w-50 py-2' onClick={() => setModal("create")}>Create Token</button>
                </div>
            </div>
        </div>
    )
}
