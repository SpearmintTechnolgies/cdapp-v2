"use client"
import React, { useContext, useEffect, useState } from "react"
import Styles from "../../style/navbar.module.css"
import Link from "next/link"
import { Profile } from "../modals/Profile"
import { Work } from "../modals/Work"
import { CreateToken } from "../modals/CreateToken"
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit"
import "@rainbow-me/rainbowkit/styles.css";
import { useAccount } from "wagmi"
import axios from "axios"
import { API_URL } from "@/src/Config"
import { ContractContext } from "@/src/Context/ContractContext"
import { usePathname, useRouter } from "next/navigation"

export const Navbar = () => {
    const { user } = useContext(ContractContext);
    const path = usePathname();
    const { openConnectModal } = useConnectModal()
    

    const [uid, setUid] = useState(false)
    const [toggleNav, setToggleNav] = useState(false)
    const [openModal, setModal] = useState(false)
    const [darkMode, setMode] = useState(false)
    const dark = () => {
        localStorage.setItem("theme_mode","dark")
        var root = document.querySelector(':root');
        root.style.setProperty('--dark', '#fff');
        root.style.setProperty('--light', '#000');
        root.style.setProperty('--bg-light', '#5D5D5D52');
        root.style.setProperty('--main-light', '#FFFFFF57');
        root.style.setProperty('--modal-bg', '#000000E0');
        root.style.setProperty('--modal-card-bg', '#191919');
        root.style.setProperty('--body-color', '#000');
        root.style.setProperty('--home-bg', '#1e1e1e');
        setMode(true)
    }
    const light = () => {
        localStorage.setItem("theme_mode","light")
        var root = document.querySelector(':root');
        root.style.setProperty('--dark', '#000');
        root.style.setProperty('--light', '#fff');
        root.style.setProperty('--bg-light', '#ffff');
        root.style.setProperty('--main-light', '#FF92114D');
        root.style.setProperty('--modal-bg', '#FDF4EAE0');
        root.style.setProperty('--modal-card-bg', '#e5e1dc');
        root.style.setProperty('--body-color', '#EDA5501F');
        root.style.setProperty('--home-bg', '#fef4eb');
        setMode(false)
    }

    const closeModal = () => {
        setModal(false)
    }
    const { address, isConnected } = useAccount();
    const createUser = async () => {

        try {
            const res = await axios.post(`${API_URL}/create/user`, {
                address: address,
            });
            if (res?.status === 201) {
                localStorage.setItem("access_token", res.data.token);
                localStorage.setItem("username", res.data.data.username);
                localStorage.setItem("uid", res.data.data._id);
                setUid(res.data.data._id)

            }
            if (res?.status === 200) {
                localStorage.setItem("access_token", res.data.token);
                localStorage.setItem("username", res.data.data.username);
                localStorage.setItem("uid", res.data.data._id);
                setUid(res.data.data._id)

            }
        } catch (err) {
            console.log(err);
            if (err.response?.status === 404) {
                console.log(err);
            }
        }
    };
    React.useEffect(() => {
        if (isConnected && address !== undefined) {
            createUser();
        }
    }, [isConnected, address]);
    React.useEffect(() => {
        if (!isConnected) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("username");
        }
    }, [isConnected]);
    const router = useRouter()
    function handleOutter(e) {
        let flage = [...e.target.classList].includes("outterMenu")
        if (flage) {
            setToggleNav(false)
        }
    }

    useEffect(()=>{
        let mode = localStorage.getItem("theme_mode")
        if(mode){
            if(mode==="dark"){
                dark()
            }else{
                light()
            }
        }
    },[])
    return (
        <>
            <div className={Styles.navbar_parent} >
                {/* show on desktop & larg viewport */}
                <nav className="navbar navbar-expand-lg " style={{ background: "transparent" }}>
                    <div className="container-fluid">
                        <Link className="navbar-brand" target="_self" href="/"><img src={darkMode ? "/assets/logo-dark.svg" : "/assets/logo.svg"} alt="Logo" /></Link>

                        <div className="collapse navbar-collapse d-none d-lg-block" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <button onClick={() => setModal("work")} style={{ color: "var(--dark)" }} className="nav-link active" aria-current="page">How it works?</button>
                                </li>
                                <li className="nav-item">
                                    <Link href="https://discord.gg/PRWw6m6HFw" target="_blank" className="nav-link">Support</Link>
                                </li>
                            </ul>

                        </div>
                        <div className="d-flex gap-3 align-items-center">

                            <div className='d-flex align-items-center gap-lg-4 gap-md-3 gap-2'>
                                <div className={Styles.mode + ' d-flex align-tiems-center'}>
                                    <button onClick={dark} className={darkMode ? "activemode" : ""}><i className="bi bi-moon-fill"></i></button>
                                    <button onClick={light} className={darkMode ? "" : "activemode"}><i className="bi bi-brightness-high-fill"></i></button>
                                </div>
                                {/* CONNECT WALLET BTN */}
                                {/* <button className="btn1 px-3 py-2 d-lg-block d-none">Connect Wallet</button> */}

                                {/* profile & option after login */}
                                <div className="d-lg-flex gap-4 d-none">
                                    {(isConnected && uid) && <button className="btn1 px-3 py-2" onClick={() => router.push(`/profile/${uid}`)}>Profile</button>}
                                    {isConnected?<ConnectButton />
                                     :<button className="btn1 px-3 py-2" onClick={openConnectModal}>Connect Wallet</button>}
                                </div>
                                {/* <div className={Styles.profile+" d-lg-flex d-none  gap-2 position-relative"}>
                                    <img src="/assets/demo1-hero.png" alt="" />
                                    <div className="d-flex align-items-center gap-5">
                                        <div>
                                        <p className="mb-0">Cosmos</p>
                                        <span>6gEFXg7EY</span>
                                        </div>
                                        <p className="mb-0"><i className="bi bi-chevron-down"></i></p>
                                    </div>
                                    <div className="position-absolute">
                                        <button className="btn1 px-3 py-2 text-nowrap w-100">Disconnect Wallet</button>
                                        <button className="btn1 mt-2 px-3 py-2 w-100" onClick={()=>setModal("profile")}>Edit Profile</button>
                                    </div>
                                </div> */}
                            </div>

                            <button className={Styles.togglerbtn + " navbar-toggler border-none outline-none shadow-none"} type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" onClick={() => setToggleNav(true)}>
                                <span><i className="bi bi-list"></i></span>
                            </button>
                        </div>
                    </div>
                </nav>




                {/* SHOW ON TAB AND MINI DEVICES */}
                <div className={`${Styles.navbar_tab} d-lg-none d-block outterMenu`} style={{ left: toggleNav ? "0" : "-100%" }} onClick={handleOutter}>
                    <div>
                        <div className="d-flex justify-content-between align-items-center">
                            <Link className="navbar-brand" target="_self" href="/"><img src={darkMode ? "/assets/logo-dark.svg" : "/assets/logo.svg"} alt="Logo" /></Link>
                            <button className={`${Styles.close_btn} border-0 bg-transparent fs-3`} onClick={() => setToggleNav(false)}><i className="bi bi-x"></i></button>
                            {/* <div>
                                <img src="" alt="" />
                                <select name="" id=""></select>
                            </div> */}
                        </div>
                        <div className="links">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item pt-4" onClick={() => { setModal("work"); setToggleNav(false) }}>
                                    <Link href="#" className="nav-link active" aria-current="page">How it works?</Link>
                                </li>
                                <li className="nav-item">
                                    <Link href="https://discord.gg/PRWw6m6HFw" className="nav-link">Support</Link>
                                </li>
                            </ul>
                            {/* <div className={Styles.profile+" d-flex pe-5 col-sm-8 col-md-6 col-10 gap-2 position-relative"}>
                                    <img src="/assets/demo1-hero.png" alt="" />
                                    <div className="d-flex align-items-center gap-5">
                                        <div>
                                        <p className="mb-0">Cosmos</p>
                                        <span>6gEFXg7EY</span>
                                        </div>
                                        <p className="mb-0"><i className="bi bi-chevron-down"></i></p>
                                    </div>
                                    <div className="position-absolute start-0">
                                        <button className="btn1 px-3 py-2 w-100 text-nowrap">Disconnect Wallet</button>
                                        <button className="btn1 mt-2 px-3 w-100 py-2" onClick={()=>setModal(!openProfile)}>Edit Profile</button>
                                    </div>
                                </div> */}
                            {isConnected && <button className="btn1 px-3 py-2 w-100 mb-3" onClick={() => { router.push(`/profile/${user?._id}`); setToggleNav(false) }}>Profile</button>}
                            {/* <ConnectButton/> */}

                            {isConnected ? <ConnectButton />
                                : <button className="btn1 px-3 py-2" onClick={openConnectModal}>Connect Wallet</button>
                            }

                        </div>
                    </div>

                </div>
            </div>
            {/* {
                openModal=="profile"?
                <Profile close={closeModal}/>:null
            } */}
            {
                openModal == "work" ?
                    <Work hide={closeModal} setModal={setModal} /> : null
            }
            {
                openModal == "create" ?
                    <CreateToken hide={closeModal} /> : null
            }
        </>
    )
}
