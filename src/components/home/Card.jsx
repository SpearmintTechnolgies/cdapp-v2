import { useReadContract } from "wagmi";
import style from "../../app/page.module.css";
import Link from "next/link";
import { API_URL, POOL_ADDRESS } from "@/src/Config";
import TOKEN_COIN_ABI from "../../Config/TOKEN_COIN_ABI.json";
import { formatEther } from "viem";
import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";


export const Card = ({ data, dex, setPop }) => {
  const rout = useRouter()
  const { data: getMarketCap } = useReadContract({
    abi: TOKEN_COIN_ABI,
    address: POOL_ADDRESS,
    functionName: "getMarketCap",
    args: [data?._id],
  });
  const [commentData, setCommentData] = useState([]);
  const [user, setUser] = useState([]);
  const getComments = async () => {
    await axios({
      method: "GET",
      url: `${API_URL}/get/comments/${data?._id}`,
    })
      .then((_data) => {
        setCommentData([]);
        if(_data.data.data){
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

  
  const getUser = async () => {
    await axios({
      method: "GET",
      url: `${API_URL}/get/single/user/${data?.createdBy}`,
    })
      .then((_data) => {
       setUser(_data.data.user)
    
      })
      .catch((err) => {
        //  throw err
        console.log(err);
      });
  };
  useEffect(()=>{
    getComments()
  },[data?._id])
  useEffect(()=>{
    getUser()
  },[data?.createdBy])
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
  function pushRoute(e) {
    let flage = [...e.target.classList].includes("social_link")
    if (!flage) {
      rout.push(`/inside/${data?._id}`)
    }
  }

  return (
    <div className={style.card} >{/*onClick={()=>setPop("happend")}*/}
      <a
        // href={`#`} 
        // href={`/inside/${data?._id}`}
        onClick={pushRoute}
        className="text-decoration-none card-container">
        <div className={style.row1 + " d-flex gap-2"}>
          <div>
            <Typography
              component={"img"}
              src={data?.image}
              sx={{
                // my: "0.5rem",
                borderRadius: "5px",
                width: { md: "65px", xs: "80px" },
                height: { md: "75px", xs: "80px" },
              }}
            />
          </div>
          <div className="flex-grow-1">
            {/* <Link href="/inside/userid" className="text-decoration-none"> */}
            <h3 className="d-flex justify-content-between">{data?.name}
              <span className="d-flex gap-2">
                {
                  data?.twitterLink != "" &&
                  <a href={`${data?.twitterLink}`} target="_blank" className="social_link">
                    <img src="/assets/icons/x.svg" width="20px" className="social_link" alt="" />
                  </a>
                }
                {
                  data?.telegramLink != "" &&
                  <a href={`${data?.telegramLink}`} className="social_link" target="_blank">
                    <img src="/assets/icons/telegram.svg" className="social_link" width="20px" alt="" />
                  </a>
                }
                {
                  data?.websiteLink != "" &&
                  <a href={`${data?.websiteLink}`} className="social_link" target="_blank">
                    <img src="/assets/icons/website.svg" className="social_link" width="20px" alt="" />
                  </a>
                }

              </span>
            </h3>
            {/* </Link> */}
            <p className="mb-0 opacity-75">
              {data?.desc.length > 160 ? data.desc.slice(0, 120) + "..." : data.desc}
            </p>
          </div>
        </div>
        <div
          className={style.secondrow + " d-flex my-4 justify-content-between"}
        >
          <div className="d-flex gap-3 gap-xxl-5">
            <div>
              <span>Symbol</span>
              <p className="mb-0 text-center">{data?.symbol}</p>
            </div>
            {!dex ? <div>
              <span>Market cap</span>
              <p className="mb-0 text-center">
                {/* $ {getMarketCap ? formatEther(getMarketCap) : 0} */}${" "}
                {data?.marketValue > 0
                  ? formatNumber(parseFloat(data?.marketValue).toFixed(2))
                  : 0}
              </p>
            </div> : null}
          </div>
          <div>
            <span>Opinions</span>
            <p className="mb-0 text-center">{commentData?.length}</p>
          </div>
        </div>
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center ">
            <p className="mb-0" style={{fontSize:"14px"}}>Market cap</p>
            <p className="mb-0 fw-semibold" style={{fontSize:"14px"}}>${data?.marketValue > 0
                  ? formatNumber(parseFloat(data?.marketValue).toFixed(2))
                  : 0}</p>
          </div>
          <input
            id="input_curve"
            type="range"
            style={{ background: `linear-gradient(to right, #F2890C 50%, var(--home-bg) 50%` }}
            className="curve-slider"
          />
        </div>
        <div
          className={
            style.thirdrow + " d-flex gap-2 justify-content-between flex-wrap"
          }
        >
          <div className="d-flex gap-2">
            <p>Created by</p>
            <div className="d-flex gap-1">
              <img src="/assets/demo2-hero.png" alt="" />
              <p className="fw-bold">
                <Link
                  href={`/profile/${user?._id}`}
                  className="text-decoration-none"
                  style={{ color: "var(--dark)" }}
                >
                {user?.username?.length > 8
                  ? `${user?.username.slice(0, 4)}...${user?.username.slice(
                    -4
                  )}`
                  : user?.username}
                </Link>
              </p>
            </div>
          </div>
          <p>
            Created On{" "}
            <strong>{new Date(data?.createdAt).toLocaleDateString()}</strong>
          </p>
        </div>
      </a>
    </div>
  );
};
