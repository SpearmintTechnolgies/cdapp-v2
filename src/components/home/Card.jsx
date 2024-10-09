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


export const Card = ({ data, dex, setPop, index }) => {
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
  useEffect(() => {
    getComments()
  }, [data?._id])
  useEffect(() => {
    getUser()
  }, [data?.createdBy])
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
    <div className={`${style.card} ${index==0?"activecard":""}`} >{/*add activecard class to for vibrate animation like other site*/}
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
            <h3>{data?.name}</h3>
            {/* </Link> */}
            <div className="d-flex justify-content-between gap-2 align-items-center">
                <p className="fs-6 fw-semibold mb-0 opacity-50 flex-grow-1" 
                  style={{
                    whiteSpace: "nowrap",
                    textOverflow:"ellipsis",
                    overflow:"hidden"
                  }}
                >{data?.symbol}</p>
              {/* <div className="d-flex align-items-center gap-2 ">
                <span className="opacity-50" style={{ fontSize: "14px" }}>Symbol</span>
                <p className="fs-6 fw-semibold mb-0 opacity-50">{data?.symbol}</p>
              </div> */}
              <span className="d-flex gap-1">
                {
                  data?.twitterLink != "" &&
                  <a href={`${data?.twitterLink}`} target="_blank" className={style.social_x + " social_link"}>
                    {/* <img src="/assets/icons/x.svg" width="20px" className="social_link" alt="" /> */}
                    <i className="bi bi-twitter-x"></i>
                  </a>
                }
                {
                  data?.telegramLink != "" &&
                  <a href={`${data?.telegramLink}`} className={style.social_t + " social_link"} target="_blank">
                    {/* <img src="/assets/icons/telegram.svg" className="social_link" width="20px" alt="" /> */}
                    <svg width="17" height="13" style={{ paddingRight: "2px" }} viewBox="0 0 29 25" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M26.5276 0.219472C26.5276 0.219472 29.2106 -0.859298 28.9867 1.76653C28.9121 2.84898 28.2416 6.63816 27.7204 10.7363L25.9317 22.8724C25.9317 22.8724 25.7825 24.6512 24.4415 24.9564C23.1006 25.2617 21.088 23.874 20.7161 23.5651C20.4176 23.3334 15.1273 19.8531 13.264 18.1528C13.0678 18.0132 12.9087 17.8249 12.8012 17.6051C12.6937 17.3853 12.6412 17.1411 12.6487 16.8948C12.6561 16.6486 12.7231 16.4082 12.8437 16.1958C12.9642 15.9834 13.1344 15.8057 13.3386 15.679L21.1627 7.94617C22.057 7.01818 22.9514 4.85328 19.2247 7.48279L8.79223 14.8319C8.25538 15.0834 7.67493 15.2199 7.08578 15.2331C6.49664 15.2464 5.911 15.1362 5.36409 14.9091L0.520391 13.3609C0.520391 13.3609 -1.26831 12.2012 1.78669 11.0415C9.23999 7.41046 18.405 3.69973 26.5276 0.219472Z" />
                    </svg>
                  </a>
                }
                {
                  data?.websiteLink != "" &&
                  <a href={`${data?.websiteLink}`} className={style.social_i + " social_link"} target="_blank">
                    {/* <img src="/assets/icons/website.svg" className="social_link" width="20px" alt="" /> */}
                    <i className="bi bi-globe"></i>
                  </a>
                }

              </span>
            </div>
            {/* <p className="mb-0 opacity-75">
              {data?.desc?.length > 160 ? data?.desc.slice(0, 100) + "..." : data.desc}
            </p> */}
          </div>
        </div>
        <p className={style.sort_desc}>
          {data?.desc?.length > 160 ? data?.desc.slice(0, 100) + "..." : data.desc}
        </p>
        {/* <div
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
                $ {getMarketCap ? formatEther(getMarketCap) : 0} }${" "}
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
        </div> */}
        <div className={style.marketcap+" mb-4"}>
          <div className="d-flex justify-content-between align-items-center ">
            <p className="mb-0">Market cap</p>
            <p className="mb-0 fw-semibold">${data?.marketValue > 0
              ? formatNumber(parseFloat(data?.marketValue).toFixed(2))
              : 0}</p>
          </div>
          <input
            id="input_curve"
            type="range"
            value={data?.marketValue > 0
              ? parseFloat(data?.marketValue).toFixed(2)*100/18859.53
              : 0}
            style={{
              background: `linear-gradient(to right, ${index==0?"#fff":"#F2890C"} ${data?.marketValue > 0
                ? parseFloat(data?.marketValue).toFixed(2)*100/18859.53
                : 0}%, ${index==0?"#FCF4EA21":"var(--home-bg)"} ${data?.marketValue > 0
              ? parseFloat(data?.marketValue).toFixed(2)*100/18859.53
              : 0}%`,
              height: "8px",
              border: "1px solid #0000000D"
            }}
            className="curve-slider"
          />
        </div>
        <div
          className={
            style.thirdrow + " d-flex gap-2 justify-content-between flex-wrap"
          }
        >
          <div className="d-flex gap-2">
            <p className="opacity-75">Created by</p>
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
            <span className="opacity-75">Created On{" "}</span>
            <strong>{new Date(data?.createdAt).toLocaleDateString()}</strong>
          </p>
        </div>
      </a>
    </div>
  );
};
