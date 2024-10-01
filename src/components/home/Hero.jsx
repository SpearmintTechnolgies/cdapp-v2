"use client"
import { useContext, useState } from "react"
import Style from "../../app/page.module.css"
import { CreateToken } from "../modals/CreateToken"
import { Work } from "../modals/Work";
import Link from "next/link"
import { ContractContext } from "@/src/Context/ContractContext"
import { useAccount } from "wagmi";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";

export const Hero = () => {
    const { openConnectModal} = useConnectModal()
    const [modal, setModal] = useState(null)
    const { crownData } = useContext(ContractContext);
    const hide = () => {
        setModal(null)
    }

    const {address} = useAccount()

    function formatNumber(num) {
        if (num >= 1000000000000) {
            // For trillions
            return (num / 1000000000000).toFixed(2).replace(/\.00$/, '') + 'T';
        } else if (num >= 1000000000) {
            // For billions
            return (num / 1000000000).toFixed(2).replace(/\.00$/, '') + 'B';
        } else if (num >= 1000000) {
            // For millions
            return (num / 1000000).toFixed(2).replace(/\.00$/, '') + 'M';
        } else if (num >= 1000) {
            // For thousands
            return (num / 1000).toFixed(2).replace(/\.00$/, '') + 'K';
        } else {
            // For numbers less than 1000
            return num.toString();
        }
    }

    return (
        <>
            <div className={Style.hero + " d-flex flex-column flex-lg-row align-items-center align-items-xxl-start container gap-5 py-5"} >
                <div className={Style.imgdiv + " col-lg-5"}>
                    {/* <img src="/assets/lending-hero.svg" width="100%" alt="" /> */}
                    <div className="position-absolute ">
                        <img className="position-absolute" src="/assets/Coin1.png" alt="" />
                        <img className="position-absolute" src="/assets/Coin2.png" alt="" />
                        <img className="position-absolute" src="/assets/Coin3.png" alt="" />
                    </div>
                </div>
                <div className={Style.hero_right}>
                    <h1>Creating your own <br /> coin has <span>never been <br /> easier.</span></h1>
                    <div className={Style.centerbtn + ' d-flex gap-sm-5 gap-3 '}>
                        {
                            address &&
                            <button className='btn1 px-4 py-2' onClick={() => setModal("create")}>Create Token</button>
                        }
                        {
                            !address &&
                            // <ConnectButton />
                            <button className='btn1 px-4 py-2' onClick={openConnectModal}>Connect Wallet</button>
                        }
                        <button className='btn2 px-4 py-2' onClick={() => setModal("work")}>How it works?</button>
                    </div>
                    <Link href={`/inside/${crownData?.coinsData?._id}`} className="text-decoration-none" style={{ color: "var(--dark)" }}>
                        <div className={Style.bottomdiv + ' d-flex flex-column align-items-sm-center align-items-lg-stretch align-items-xl-center flex-sm-row flex-lg-column flex-xl-row flex-lg-column flex-xl-row justify-content-between gap-md-4 gap-2'}>
                            <div className='d-flex gap-2 gap-xl-4'>
                                <img src={crownData?.coinsData?.image} alt="" />
                                <div>
                                    <h3> {crownData?.coinsData?.name} </h3>
                                    <div className='d-flex gap-md-3 gap-2'>
                                        <p className="mb-0 opacity-75">Badge <strong className="fw-blod">Crown</strong></p>
                                        <div className='d-flex gap-1'>
                                            <img src="/assets/demo2-hero.png" alt="" />
                                            <p className="mb-0">
                                                <Link href="/profile/useid" className="text-decoration-none fw-semibold" style={{ color: "var(--dark)" }}>
                                                    {crownData?.username?.length > 8
                                                        ? `${crownData?.username.slice(
                                                            0,
                                                            4
                                                        )}...${crownData?.username.slice(-4)}`
                                                        : crownData?.username}
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='d-flex gap-md-4 gap-2 justify-content-between'>
                                <div className="d-flex flex-column align-items-center gap-2">
                                    <span>Symbol</span>
                                    <p className="mb-0 text-center">  {crownData?.coinsData?.symbol?.length > 8
                                        ? `${crownData?.coinsData?.symbol.slice(
                                            0,
                                            4
                                        )}...${crownData?.coinsData?.symbol.slice(-4)}`
                                        : crownData?.coinsData?.symbol}</p>
                                </div>
                                <div className="d-flex flex-column align-items-center gap-2">
                                    <span className="w-100 text-center">Market cap</span>
                                    <p className="mb-0 text-center"> ${" "}
                                        {crownData?.coinsData?.marketValue > 0
                                            ? formatNumber(parseFloat(crownData?.coinsData?.marketValue).toFixed(2))
                                            : 0}</p>
                                </div>
                                <div className="d-flex flex-column align-items-center gap-2">
                                    <span>Opinions</span>
                                    <p className="mb-0 text-center">{crownData?.comments}</p>
                                </div>
                            </div>
                        </div>
                    </Link >
                </div>
            </div >
            {
                modal === "create" ?
                    <CreateToken hide={hide} /> : null
            }
            {
                modal === "work" ?
                    <Work hide={hide} setModal={setModal} /> : null
            }
        </>
    )
}
