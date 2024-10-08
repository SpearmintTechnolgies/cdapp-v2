"use client"
import { useContext, useEffect, useState } from "react"
import Style from "../../app/page.module.css"
import { CreateToken } from "../modals/CreateToken"
import { Work } from "../modals/Work";
import Link from "next/link"
import { ContractContext } from "@/src/Context/ContractContext"
import { useAccount } from "wagmi";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import axios from "axios";
import { API_URL } from "@/src/Config";
import { New_token_card } from "./New_token_card";
import Slider from "react-slick";

export const Hero = () => {
    const { openConnectModal } = useConnectModal()
    const [modal, setModal] = useState(null)
    const { crownData } = useContext(ContractContext);
    const [commentData, setCommentData] = useState([]);

  const { coinData } = useContext(ContractContext);

    const getComments = async () => {
        await axios({
            method: "GET",
            url: `${API_URL}/get/comments/${crownData?.coinsData?._id}`,
        })
            .then((_data) => {
                setCommentData([]);
                if (_data.data.data) {
                    const reversedArray = _data.data.data.reverse();
                    setCommentData(reversedArray);
                    // getCoin()
                    // getUserLikes()
                }

            })
            .catch((err) => {
                //  throw err
                console.log(err);
            });
    };


    


    useEffect(() => {
        getComments()
      
    }, [crownData?.coinsData?._id])
    const hide = () => {
        setModal(null)
    }

    const [latestTrade, setLatestTrade] = useState([]);
    const getTrades = async () => {
      await axios({
        method: "GET",
        url: `${API_URL}/get/latest/trades`,
      })
        .then((_data) => {
          setLatestTrade(_data.data.trades);
  
        })
        .catch((err) => {
          //  throw err
          console.log(err);
        });
    };
    useEffect(() => {
      getTrades()
    }, [])


    const { address } = useAccount()

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

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        vertical: true,
        // verticalSwiping: true,
        autoplay: true,
        speed: 800,
        rtl:true,
        autoplaySpeed: 100,
        // beforeChange: function(currentSlide, nextSlide) {
        //   console.log("before change", currentSlide, nextSlide);
        // },
        // afterChange: function(currentSlide) {
        //   console.log("after change", currentSlide);
        // }
    };

    return (
        <>
            <div className={Style.hero + " d-flex flex-column flex-lg-row align-items-center align-items-xl-end container gap-5 py-5"} >
                {/* <div className={Style.imgdiv + " col-lg-5"}>
                    <div className="position-absolute ">
                        <img className="position-absolute" src="/assets/Coin1.png" alt="" />
                        <img className="position-absolute" src="/assets/Coin2.png" alt="" />
                        <img className="position-absolute" src="/assets/Coin3.png" alt="" />
                    </div>
                </div> */}
                <div className={Style.left_parent + " col-lg-5"}>
                <div className={Style.left}>
                    <div className={Style.new_token}>
                        <div className="d-flex justify-content-between">
                            <div className="d-flex align-items-center gap-2">
                                <img src="/assets/new.svg" alt="" />
                                <p className="mb-0">New Token</p>
                            </div>
                            <p className="mb-0">Just now</p>
                        </div>
                        {/* <New_token_card /> */}
                    </div>
                    <div className={Style.carousel+" hero_crousel"}>
                        <Slider {...settings}>
                            {
                                coinData?.map((v,i) => {      
                                    return (
                                        <New_token_card data={v} />                                 
                                    )                            
                                })
                            }
                        </Slider>
                    </div>
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
                    <div className={Style.bottomdiv_parent}>
                        <div className="d-flex justify-content-between align-items-center px-3 py-2">
                            <div className="d-flex gap-3 align-items-center">
                                <img src="/assets/white-logo.svg" alt="" />
                                <p className="mb-0 text-white fw-semibold" style={{ fontSize: "14px" }}>Featured</p>
                            </div>
                            <div>
                                <Link href="#" className="text-decoration-none text-white fw-semibold" style={{ fontSize: "14px" }}>Your’s Here <img src="/assets/icons/right-top-arrow.svg" alt="" /></Link>
                            </div>
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
                                        <p className="mb-0 text-center">{commentData?.length}</p>
                                    </div>
                                </div>
                            </div>
                        </Link >
                    </div>
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
