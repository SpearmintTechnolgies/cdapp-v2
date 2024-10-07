"use client";

import Reply from "@/src/components/modals/Reply";
import style from "../../../style/inside.module.css";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { Slipage } from "@/src/components/modals/Slipage";
import { API_URL, POOL_ADDRESS } from "@/src/Config";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams } from "next/navigation";
import { Alert, Box, Snackbar, Typography } from "@mui/material";
import LightweightChart from "../../../components/LightWeightTradingChart";
import TradeContainer from "../TradeContainer";
import HolderDistribution from "../HolderDistribution";
import { useAccount, useBalance, useBlockNumber, useReadContract } from "wagmi";
import { erc20Abi, formatEther, formatUnits, parseEther } from "viem";
import TOKEN_COIN_ABI from "../../../Config/TOKEN_COIN_ABI.json";
import { useQueryClient } from "@tanstack/react-query";
import { ContractContext } from "@/src/Context/ContractContext";
import Message from "./Message";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import BubbleChartComponent from "../BubbleChartComponent";
import { useRouter } from "next/navigation";
import { Loader } from "@/src/components/common/Loader";



const page = () => {
  // const rout = useRouter()
  // return rout.push("/")
  const { id: projectId } = useParams();
  const [showChart, setShowChart] = useState(false);
  const { crownData } = useContext(ContractContext);
  const [commentData, setCommentData] = useState([]);
  const [modal, setModal] = useState(null);
  const [sell, setSell] = useState(false);
  const [tokenChartData, setTokenChartData] = useState({});
  const [tokenData, setTokenData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState(null);
  const [verifyErr, setVerifyErr] = useState(null);
  const [trades, setTrades] = useState([]);
  const [chartBg , setCartBg] = useState(false)
  const getHolderDistribution = async () => {
    await axios({
      method: "GET",
      url: `${API_URL}/get/trades/${projectId}`,
      headers: {
        "Accept-Encoding": "application/json",
        // 'Origin' : process.env.ORIGIN
      },
    })
      .then((_data) => {
        setTrades(_data.data.trades);
      })
      .catch((err) => {
        //  throw err
        console.log(err);
      });
  };
  useEffect(() => {
    getHolderDistribution();
    // getComments(projectId)
  }, [projectId]);
  const hide = () => {
    setModal(null);
  };
  const getComments = async () => {
    await axios({
      method: "GET",
      url: `${API_URL}/get/comments/${projectId}`,
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
  useEffect(() => {
    if (projectId) {
      // setInterval(() => {
        getComments();
        getTokenDetail();
        getTokenChartDetail();

      // }, 3000);
    }
  }, [projectId]);
  const getTokenChartDetail = async () => {
    await axios({
      method: "GET",
      url: `${API_URL}/get/chart/trades/${projectId}`,
      headers: {
        "Accept-Encoding": "application/json",
        // 'Origin' : process.env.ORIGIN
      },
    })
      .then((response) => {
        setTokenChartData(response.data.ohlcValues);
      })
      .catch((err) => {
        //  throw err
        console.log(err);
      });
  };
  const getTokenDetail = async () => {
    await axios({
      method: "GET",
      url: `${API_URL}/token-coin/${projectId}`,
      headers: {
        "Accept-Encoding": "application/json",
        // 'Origin' : process.env.ORIGIN
      },
    })
      .then((_data) => {
        setTokenData(_data.data.data);
      })
      .catch((err) => {
        //  throw err
        console.log(err);
      });
  };

  const [user, setUser] = useState({});
  const getUser = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/get/single/user/${tokenData?.createdBy}`
      );
      if (res.status === 200) {
        setUser(res.data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    if (tokenData?.createdBy) {
      getUser();
    }
  }, [tokenData?.createdBy]);
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });

  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: getContributeTokenBal } = useReadContract({
    abi: erc20Abi,
    address: tokenData?.address,
    functionName: "balanceOf",
    args: [POOL_ADDRESS],
  });
  const { data: alternateToken } = useReadContract({
    abi: TOKEN_COIN_ABI,
    address: POOL_ADDRESS,
    functionName: "alternateToken",
    args: [],
  });
  const { data: getTokenSymbol } = useReadContract({
    abi: erc20Abi,
    address: alternateToken,
    functionName: "symbol",
    args: [],
  });

  const { data: getTokenBal, queryKey: getTokenBalQuerryKey } = useReadContract(
    {
      abi: erc20Abi,
      address: tokenData?.address,
      functionName: "balanceOf",
      args: [address],
    }
  );
  const { data: projectRequiredCap, queryKey: projectRequiredCapQueryKey } =
    useReadContract({
      abi: TOKEN_COIN_ABI,
      address: POOL_ADDRESS,
      functionName: "projectRequiredCap",
      args: [],
    });

  const { data: getCurrentPrice, queryKey: getCurrentPriceQueryKey } =
    useReadContract({
      abi: TOKEN_COIN_ABI,
      address: POOL_ADDRESS,
      functionName: "getCurrentPrice",
      args: [projectId],
    });




  const { data: getRequiredTokenSell, queryKey: getRequiredTokenSellQueryKey } =
    useReadContract({
      abi: TOKEN_COIN_ABI,
      address: POOL_ADDRESS,
      functionName: "REQUIRE_TOKEN_SELL",
      args: [],
    });

  const { data: getTokensSold, queryKey: getTokensSoldQueryKey } =
    useReadContract({
      abi: TOKEN_COIN_ABI,
      address: POOL_ADDRESS,
      functionName: "tokensSold",
      args: [projectId],
    });

  const { data: initialPrice, queryKey: initialPriceQueryKey } =
    useReadContract({
      abi: TOKEN_COIN_ABI,
      address: POOL_ADDRESS,
      functionName: "initialPrice",
      args: [],
    });

  const { data: getPrice, queryKey: getPriceQueryKey } =
    useReadContract({
      abi: TOKEN_COIN_ABI,
      address: POOL_ADDRESS,
      functionName: "getPrice",
      args: [projectId, false],
    });
  const { data: getMarketCap, queryKey: getMarketCapQueryKey } =
    useReadContract({
      abi: TOKEN_COIN_ABI,
      address: POOL_ADDRESS,
      functionName: "getMarketCap",
      args: [projectId],
    });

  const { data: getTokenForLiquiidty, queryKey: getTokenForLiquiidtyQueryKey } =
    useReadContract({
      abi: TOKEN_COIN_ABI,
      address: POOL_ADDRESS,
      functionName: "REQUIRE_TOKEN_LIQUIIDTY",
      args: [],
    });

  const { data: getTokenSupply, queryKey: getTokenSupplyQueryKey } =
    useReadContract({
      abi: TOKEN_COIN_ABI,
      address: POOL_ADDRESS,
      functionName: "INITIAL_SUPPLY",
      args: [],
    });


  const { data: getBNBPrice, queryKey: getBNBPriceQueryKey } = useReadContract({
    abi: TOKEN_COIN_ABI,
    address: POOL_ADDRESS,
    functionName: "getBNBPrice",
    args: [],
  });

  const { data: projects, queryKey: projectsQueryKey } = useReadContract({
    abi: TOKEN_COIN_ABI,
    address: POOL_ADDRESS,
    functionName: "projects",
    args: [projectId],
  });

  // console.log("projects", projects);


  // const { data: getTokensForAmount } = useReadContract({
  //   abi: TOKEN_COIN_ABI,
  //   address: POOL_ADDRESS,
  //   functionName: "getBuyTokens",
  //   args: [projectId, projects?.[7], parseEther('1')],
  // });

  useEffect(() => {
    if (
      projectRequiredCapQueryKey ||
      getMarketCapQueryKey ||
      getBNBPriceQueryKey ||
      getPriceQueryKey ||
      projectsQueryKey ||
      getTokenForLiquiidtyQueryKey ||
      getTokenSupplyQueryKey ||
      initialPriceQueryKey ||
      getRequiredTokenSellQueryKey ||
      getCurrentPriceQueryKey ||
      getTokensSoldQueryKey ||
      getTokenBalQuerryKey
    ) {
      queryClient.invalidateQueries({ queryKey: projectRequiredCapQueryKey });
      queryClient.invalidateQueries({ queryKey: getMarketCapQueryKey });
      queryClient.invalidateQueries({ queryKey: getBNBPriceQueryKey });
      queryClient.invalidateQueries({ queryKey: getCurrentPriceQueryKey });
      queryClient.invalidateQueries({ queryKey: getPriceQueryKey });
      queryClient.invalidateQueries({ queryKey: initialPriceQueryKey });
      queryClient.invalidateQueries({ queryKey: projectsQueryKey });
      queryClient.invalidateQueries({ queryKey: getTokenSupplyQueryKey });
      queryClient.invalidateQueries({ queryKey: getTokenBalQuerryKey });
      queryClient.invalidateQueries({ queryKey: getTokenForLiquiidtyQueryKey });
      queryClient.invalidateQueries({ queryKey: getRequiredTokenSellQueryKey });
      queryClient.invalidateQueries({ queryKey: getTokensSoldQueryKey });
    }
  }, [
    address,
    blockNumber,
    queryClient,
    projectRequiredCapQueryKey,
    getMarketCapQueryKey,
    getBNBPriceQueryKey,
    getPriceQueryKey,
    getCurrentPriceQueryKey,
    projectsQueryKey,
    getTokenSupplyQueryKey,
    getTokenForLiquiidtyQueryKey,
    getTokenBalQuerryKey,
    initialPriceQueryKey,
    getTokensSoldQueryKey,
    getTokensSoldQueryKey
  ]);
  const [rangeValue, setRangeValue] = useState(0);
  const [curveValue, setCurveValue] = useState(0);
  const [rise, setRise] = useState(0);

  const [image, setImage] = useState(null);
  const [imageErr, setImageErr] = useState("");
  const [responseErr, setResponseErr] = useState("");
  const [targetCap, setTargetCap] = useState("");
  const [marketCap, setMarketCap] = useState("");

  const handleImage = (e) => {
    setImageErr("");
    setImage(e.target.files[0]);
  };


  useEffect(() => {
    if (tokenChartData) {
      if (tokenChartData.length > 0) {
        // console.log(tokenChartData);

        let currentPrice = tokenChartData[tokenChartData.length - 1].close;
        let _initialPrice = tokenChartData[0].open;
        let rise = ((currentPrice) / (_initialPrice)) - 1
        setRise(parseFloat(rise * 100).toFixed(3))
      }

    }

  }, [tokenChartData])


  useEffect(() => {
    if (projectRequiredCap && getTokenForLiquiidty && getTokenSupply && projects) {
      const _targetPrice = parseFloat(getTokenForLiquiidty / projectRequiredCap);
      const _currentPrice = projects?.[6] ? parseFloat(getTokenForLiquiidty / projects?.[6]) : 0;
      const targetValue = parseFloat(formatEther(getTokenSupply) / _targetPrice).toFixed(6) * (1 / (formatEther(getBNBPrice || 0) / 1e12))
      const currentValue = _currentPrice ? parseFloat(formatEther(getTokenSupply) / _currentPrice).toFixed(6) * (1 / (formatEther(getBNBPrice || 0) / 1e12)) : 0;

      setTargetCap(targetValue)
      setMarketCap(currentValue)
    }

  }, [getTokenForLiquiidty, getTokenSupply, projects, projectRequiredCap])


  const change = (event) => {
    // setRangeValue(event.target.value);
  };
  useEffect(() => {
    const slider = document.getElementById("input");
    if (slider) {
      slider.style.background = `linear-gradient(to right, #F2890C ${rangeValue}%, var(--body-color) ${rangeValue}%)`;
    }
  }, [rangeValue]);
  useEffect(() => {
    const slider = document.getElementById("input_curve");
    if (slider) {
      slider.style.background = `linear-gradient(to right, #F2890C ${curveValue}%, var(--body-color) ${curveValue}%)`;
    }
  }, [curveValue]);

  // const formatNumber = (num) => {
  //   if (num >= 1000) {
  //     return (num / 1000).toFixed(1) + "K";
  //   }
  //   return num?.toString();
  // };
  //  console.log(tokenData?.marketValue);

  useEffect(() => {
    if (tokenData?.marketValue > 0 && crownData?.coinsData?.marketValue > 0) {
      setRangeValue(
        parseFloat(
          (tokenData?.marketValue || 0) /
          (crownData?.coinsData?.marketValue || 0)
        ).toFixed(2) * 100
      );
    } else {
      setRangeValue(0);
    }
  }, [tokenData?.marketValue, crownData?.coinsData?.marketValue]);

  useEffect(() => {
    setCurveValue(
      parseFloat(
        formatEther(projects?.[6] || 0) / formatEther(projectRequiredCap || 0)
      ).toFixed(4) * 100
    );
  }, [getTokenBal, projectRequiredCap]);

  const getInitialValues = () => {
    return {
      comment: "",
    };
  };
  const validationSchema = Yup.object({
    comment: Yup.string()
      .trim("Comment should not contain spaces")
      .required("Required"),
  });
  const initialValues = getInitialValues();
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (
      values,
      { setErrors, setSubmitting, resetForm, errors }
    ) => {
      if (errors) {
        setErrors(errors);
      }
      createComment();
    },
  });
  const createComment = async () => {
    setLoading(true);
    try {
      // const config = {
      //   headers: {
      //     "x-access-token": localStorage.getItem("access_token"),
      //   },
      // };
      // const res = await axios.post(
      //   `${API_URL}/create/comment`,
      //   {
      //     projectId: projectId,
      //     comment: formik.values.comment,
      //   },
      //   config
      // );
      const formData = new FormData();
      formData.append("projectId", projectId);
      formData.append("comment", formik.values.comment);
      if (image) formData.append("image", image);

      const res = await axios.post(`${API_URL}/create/comment`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-access-token": localStorage.getItem("access_token"),
        },
      });
      if (res.status === 201) {
        setImage("")
        setLoading(false);
        setShowSnackbar(true);
        getComments();
        setTimeout(() => {
          setShowSnackbar(false);
        }, 2000);
        formik.resetForm();
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  // console.log(trades);

  // Initialize the highcharts-more module
  // HighchartsMore(Highcharts);
  // const generateBubbleChartOptions = () => {
  //   return {
  //     chart: {
  //       type: 'bubble',
  //       plotBorderWidth: 1,
  //       zooming: { type: 'xy' },
  //     },
  //     title: { text: 'Trade Distribution Bubble Chart' },
  //     xAxis: {
  //       title: { text: 'Trade Amount' },
  //       labels: { format: '{value}' },
  //     },
  //     yAxis: {
  //       title: { text: 'Tokens Traded' },
  //       labels: { format: '{value}' },
  //     },
  //     tooltip: {
  //       useHTML: true,
  //       headerFormat: '<table>',
  //       pointFormat:
  //         '<tr><th colspan="2"><h3>{point.user}</h3></th></tr>' +
  //         '<tr><th>Trade Amount:</th><td>{point.x}</td></tr>' +
  //         '<tr><th>Tokens Traded:</th><td>{point.y}</td></tr>' +
  //         '<tr><th>Trade Weight:</th><td>{point.z}</td></tr>',
  //       footerFormat: '</table>',
  //       followPointer: true,
  //     },
  //     series: [
  //       {
  //         data: trades.map((trade) => ({
  //           x: trade.amount / 1e18, // Converting Wei to Ether for trade amount
  //           y: trade.tokens / 1e18, // Converting tokens from Wei
  //           z: trade.timestamp, // You can use this as the "weight" or bubble size
  //           name: trade.project, // Project name or any other relevant field
  //           user: trade.user, // User who made the trade
  //         })),
  //         colorByPoint: true,
  //       },
  //     ],
  //   };
  // };

  const tokensCap = 50e6;

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
  // if(!user.username){
  //   return <div className="d-flex justify-content-center align-items-center " style={{height:"75vh"}}>
  //     <Loader/>
  //   </div>
  // }

  const handleCopy = (address) => {
    navigator.clipboard.writeText(address)
  };


  const verifyTokenContract = async () => {
    // setLoading(true);
    try {
      const config = {
        headers: {
          "x-access-token": localStorage.getItem("access_token"),
        },
      };
      const res = await axios.post(
        `${API_URL}/verify/contract`,
        {
          contractaddress: tokenData?.address,
          tokenName: tokenData?.name,
          tokenSymbol: tokenData?.symbol,
        },
        config
      );
    
      if (res.status === 200) {
       getTokenDetail()
       setVerifySuccess("Verified Successfully")
       setShowSnackbar(true)
       setTimeout(() => {
        setShowSnackbar(false)
        setVerifySuccess(null)
       }, 5000);
      }
    } catch (error) {
      setShowSnackbar(true)
      setVerifyErr(error.response.data.message)
      setTimeout(() => {
        setShowSnackbar(false)
        setVerifyErr(null)
       }, 5000);
     
   
    }
  };

  return (
    <>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{
          "& .MuiSvgIcon-root": {
            color: verifyErr?"red":"green",
          },
        }}
      >
        <Alert
          severity={verifyErr?"error":"success"}
          style={{
            backgroundColor: "#131722",
            color: verifyErr?"red":"green",
            fontSize: "15px",
            // fontFamily: "latoBold",
            display: "flex",
            alignItems: "center",
            fontWeight: "600",
          }}
        >
          {verifyErr?verifyErr:verifySuccess?verifySuccess:"Comment submitted Successfully."}
        </Alert>
      </Snackbar>
      <div
        className={
          style.indside_container +
          " my-5 d-flex flex-column flex-lg-row gap-xl-5 gap-3 justify-content-between"
        }
      >
        {/* Right content ============================================================= */}
        <div className={style.left_inside + " col-lg-8"}>
          <div className={style.row1 + " p-md-5 p-sm-4 p-2"}>
            <div className="d-flex flex-column flex-wrap gap-2  flex-sm-row justify-content-between p-3 p-sm-0">
              <div className="d-flex gap-3">
                <Typography
                  component={"img"}
                  src={tokenData?.image}
                  alt=""
                  borderRadius="12px"
                  width={"54px"}
                  height={"54px"}
                />
                <div>
                  <h1>{tokenData?.name}</h1>
                  <div className="d-flex flex-column flex-md-row gap-lg-3 gap-1 flex-wrap">
                    <p className="mb-0 text-nowrap opacity-75">
                      Badge <strong>Crown</strong>
                    </p>
                    <p className="mb-0 text-nowrap fw-blod">
                      <Link
                        href={`/profile/${user?._id}`}
                        className="text-decoration-none"
                        style={{ color: "var(--dark)" }}
                      >
                        {" "}
                        {user?.username}
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
              <div className="d-flex  justify-content-between gap-xxl-5 gap-md-3 gap-2 flex-wrap ">
                <div className="d-flex align-items-center d-sm-block gap-2 ">
                  <span>Symbol</span>
                  <p className="mb-0">{tokenData?.symbol}</p>
                </div>
                <div className="d-flex align-items-center d-sm-block gap-2 ">
                  <span>Market cap</span>
                  <p className="mb-0 text-nowrap">
                    ${formatNumber(parseFloat(marketCap).toFixed(2))}
                  </p>
                </div>
              </div>
              <div className="d-flex gap-2">
                {
                  tokenData?.twitterLink != "" &&
                  <a href={tokenData?.twitterLink} target="_blank" className={style.social_x}>
                    {/* <img src="/assets/icons/x.svg" width="20px" alt="" /> */}
                    <i className="bi bi-twitter-x"></i>
                  </a>
                }
                {
                  tokenData?.telegramLink != "" &&
                  <a href={tokenData?.telegramLink} target="_blank" className={style.social_t}>
                    {/* <img src="/assets/icons/telegram.svg" width="20px" alt="" /> */}
                    <svg width="20" height="16" viewBox="0 0 29 25" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M26.5276 0.219472C26.5276 0.219472 29.2106 -0.859298 28.9867 1.76653C28.9121 2.84898 28.2416 6.63816 27.7204 10.7363L25.9317 22.8724C25.9317 22.8724 25.7825 24.6512 24.4415 24.9564C23.1006 25.2617 21.088 23.874 20.7161 23.5651C20.4176 23.3334 15.1273 19.8531 13.264 18.1528C13.0678 18.0132 12.9087 17.8249 12.8012 17.6051C12.6937 17.3853 12.6412 17.1411 12.6487 16.8948C12.6561 16.6486 12.7231 16.4082 12.8437 16.1958C12.9642 15.9834 13.1344 15.8057 13.3386 15.679L21.1627 7.94617C22.057 7.01818 22.9514 4.85328 19.2247 7.48279L8.79223 14.8319C8.25538 15.0834 7.67493 15.2199 7.08578 15.2331C6.49664 15.2464 5.911 15.1362 5.36409 14.9091L0.520391 13.3609C0.520391 13.3609 -1.26831 12.2012 1.78669 11.0415C9.23999 7.41046 18.405 3.69973 26.5276 0.219472Z" />
                    </svg>
                  </a>
                }
                {
                  tokenData?.websiteLink != "" &&
                  <a href={tokenData?.websiteLink} target="_blank" className={style.social_i}>
                    {/* <img src="/assets/icons/telegram.svg" width="20px" alt="" /> */}
                    <i className="bi bi-globe"></i>
                  </a>
                }

              </div>
            </div>
            <div className="my-4">
              <p>{tokenData?.desc}</p>
            </div>
            <div className={style.token_data + " d-flex flex-wrap gap-3"}>
              <div className="d-flex gap-1">
                <span>Virtual Liquidity</span>
                <p>${parseFloat(formatEther(projects?.[6] || 0) * (1 / (formatEther(getBNBPrice || 0) / 1e12))).toFixed(2)}</p>
              </div>
              {/* <div className="d-flex gap-1">
                <span>Volume </span>
                <p>$22.18K</p>
              </div> */}
              <div className="d-flex gap-1">
                <span>Price </span>
                <p>${parseFloat(formatEther(getCurrentPrice || 0) * (1 / (formatEther(getBNBPrice || 0) / 1e12))).toFixed(8)}</p>
              </div>
              <div className="d-flex gap-1">
                <span>Rise </span>
                <p>{rise}%</p>
              </div>
              <div className="d-flex gap-1">
                <span>CA</span>
                <p id="ca">{`${tokenData?.address?.slice(0, 6)}...${tokenData?.address?.slice(
                    -4
                  )}`}
                  <button onClick={() => handleCopy(tokenData?.address)} className="border-0 text-secondary bg-transparent"><i class="bi bi-copy"></i></button>
                  </p>
              </div>
              <div className="d-flex gap-1">
            
                {tokenData?.verified?"Verified":  <button onClick={verifyTokenContract} className="border-0 text-secondary bg-transparent"><i title="verify"  class="bi bi-link"></i></button>}
                
              </div>
            </div>
            <div>
              <LightweightChart chartData={tokenChartData} />
            </div>
          </div>
          <div className={style.row2 + " p-4 mt-4 hideOnMobile"}>
            {isConnected && (
              <form onSubmit={formik.handleSubmit}>
                <div className={style.comment}>
                  <textarea id="comment"
                    name="comment" placeholder="Enter Comment" value={formik.values.comment}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}></textarea>

                  <div className="d-flex justify-content-end gap-3">
                    <div className="position-relative">
                      <input onChange={handleImage} type="file" />
                      <label htmlFor="">Upload Image</label>
                    </div>

                    <Typography pt={".2rem"}>{image?.name}</Typography>
                    {imageErr && (
                      <Typography variant="body1" className="error">
                        {imageErr}
                      </Typography>
                    )}
                    {responseErr && (
                      <Typography variant="body1" className="error">
                        {responseErr}
                      </Typography>
                    )}
                    <button className="btn1 px-3 py-2" type="submit">{loading ? "Submitting..." : "Post"}</button>
                  </div>
                </div>
                {formik.touched.comment && formik.errors.comment && (
                  <Typography
                    variant="body1"
                    sx={{
                      color: "red",
                      fontSize: "14px",
                      textAlign: "start",
                    }}
                  >
                    {formik.errors.comment}
                  </Typography>
                )}
              </form>
            )}

            <div className="mt-4">
              {commentData &&
                commentData?.map((e, i) => <Message data={e} key={i} />)}
            </div>
          </div>
        </div>

        {/* Right content ============================================================= */}
        <div
          className={
            style.right_inside +
            " d-md-flex gap-4 justify-content-between flex-grow-1 d-lg-block flex-wrap"
          }
        >
          {
            parseInt(projects?.[4]) == 1 &&
            <div
              className={
                style.row1 +
                " p-4 d-lg-block d-md-flex flex-column justify-content-between mb-3"
              }
            >
              <TradeContainer tokenData={tokenData} getHolderDistribution={getHolderDistribution} getTokenChartDetail={getTokenChartDetail} getTokenDetail={getTokenDetail} />
              {/* <div className={style.tabbtn + " mb-2"}>
                            <button className={!sell?'border-0 activefilter':"border-0"} onClick={()=>setSell(false)}>Buy</button>
                            <button className={sell?'border-0 activefilter':"border-0"} onClick={()=>setSell(true)}>Sell</button>
                        </div>
                        <div>
                            <div className={style.inputfield + ' d-flex'}>
                                <input type="number" placeholder="0.0" />
                                <button className='d-flex gap-1 border-0 bg-white '>
                                    <img src="/assets/cube.svg" alt="" />
                                    Core
                                </button>
                            </div>
                            <div className="d-flex justify-content-end">
                                <button className="border-0 opacity-75 bg-transparent" onClick={()=>setModal("slipage")} style={{color:"var(--dark)"}}>Set max slippage</button>
                            </div>

                            <p className='text-end'></p>
                        </div>
                        <button className='btn1 py-2 w-100 mt-5'>Place Trade</button> */}
            </div>
          }

          {
            parseInt(projects?.[4]) == 2 &&
            <div className="mb-3">
              <Link href={`https://www.archerswap.finance/swap?outputCurrency=${projects?.[8]}`} className="text-uppercase text-decoration-none d-flex justify-content-between align-items-center px-3 py-2" target="_blank"
                style={{
                  border: "1px solid var(--main_color)",
                  borderRadius: "10px",
                  color: "var(--main_color)",
                  fontFamily: "var(--font-tomy)"
                }}
              >
                <span className="fs-6">Swap On ARCHERSWAP</span>
                <span className="fs-4"><i class="bi bi-arrow-right"></i></span>
              </Link>
            </div>
          }

          {
            parseInt(projects?.[4]) == 1 &&

            <div className={style.row2 + " my-lg-4 p-4"}>
              <div className="d-flex justify-content-between">
                <h6>Bonding curve progress</h6>
                <p className="mb-0">{parseFloat(curveValue).toFixed(2) || 0}%</p>
              </div>
              {/* <div className={style.progressbar}> */}
              <input
                id="input_curve"
                type="range"
                value={curveValue}
                // onChange={change}
                style={{background:`linear-gradient(to right, #F2890C ${curveValue}%, var(--body-color) ${curveValue}%)`}}
                className="curve-slider"
              />
              {/* </div> */}
              <p className="text-center">
                When the market cap reaches ${parseFloat(targetCap).toFixed(2)} all the liquidity from the bonding curve will be deposited into Archerswap and Locked. Progression increases as the price goes up.
              </p>
              <p className="text-center">
                There are {parseFloat(formatEther(getRequiredTokenSell || 0) - formatEther(getTokensSold || 0)).toFixed(2)} tokens still available for sale in the
                bonding curve and there is {parseFloat(formatEther(projects?.[6] || 0)).toFixed(2)}{" "}
                {tokenData?.isToken == true ? getTokenSymbol : balance?.symbol} in the bonding curve.
              </p>
              <div className="d-flex justify-content-between">
                <h6>Badge crown progress</h6>
                <p className="mb-0">{parseFloat(rangeValue).toFixed(2)}%</p>
              </div>
              <input
                id="input"
                type="range"
                value={rangeValue}
                onChange={change}
                style={{background:`linear-gradient(to right, #F2890C ${rangeValue}%, var(--body-color) ${rangeValue}%)`}}
                className="custom-slider"
              />


              {rangeValue == 100 ?
                <p className="text-center" style={{ fontSize: "16px" }}>
                  You are the current crown holder.
                </p> :
                <p className="text-center">
                  dethrone the current king at a @ ${" "}
                  {crownData?.coinsData?.marketValue > 0
                    ? parseFloat(crownData?.coinsData?.marketValue).toFixed(2)
                    : 0}{" "} mcap
                </p>}
            </div>
          }
          <div className={style.row3 + " p-4"}>
            <h5 className="mb-4">Holder distribution</h5>
            <ol className="ps-3">
              {trades?.map((e, i) => (
                <HolderDistribution e={e} i={i} tokenAdd={tokenData?.address} />
              ))}
            </ol>
            <button
              className="w-100 py-2 mt-4"
              onClick={showChart ? () => setShowChart(false) : () => setShowChart(true)}
            >
              Generate bubble map
            </button>

            {/* {showChart && (
        <HighchartsReact
          highcharts={Highcharts}
          options={generateBubbleChartOptions()}
        />
      )} */}
            {showChart && <Box
              sx={{
                position: "fixed",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                background: "var(--modal-bg)",
                zIndex: "999",
                padding: "5rem 0",
                backdropFilter: "blur(5px)"
              }}
            >
              <div className={style.bubble_container}>
                <button className="border-0 " style={{ color: "var(--dark)", background: "var(--light)" }} onClick={() => setShowChart(false)}><i class="bi bi-x-lg"></i></button>
                <h2 className="fs-5 fw-semibold">Bubble Map</h2>
                <BubbleChartComponent trades={trades} />
              </div>
            </Box>}
          </div>

          <div className={`${style.row2} ${style.mini_com_parent} p-4 mt-4 hideOnDesk`}>
            {isConnected && (
              <form onSubmit={formik.handleSubmit}>
                <div className={style.comment}>
                  <textarea id="comment"
                    name="comment" placeholder="Enter Comment" value={formik.values.comment}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}></textarea>

                  <div className="d-flex justify-content-end gap-3">
                    <div className="position-relative">
                      <input onChange={handleImage} type="file" />
                      <label htmlFor="">Upload Image</label>
                    </div>

                    <Typography pt={".2rem"}>{image?.name}</Typography>
                    {imageErr && (
                      <Typography variant="body1" className="error">
                        {imageErr}
                      </Typography>
                    )}
                    {responseErr && (
                      <Typography variant="body1" className="error">
                        {responseErr}
                      </Typography>
                    )}
                    <button className="btn1 px-3 py-2" type="submit">{loading ? "Submitting..." : "Post"}</button>
                  </div>
                </div>
                {formik.touched.comment && formik.errors.comment && (
                  <Typography
                    variant="body1"
                    sx={{
                      color: "red",
                      fontSize: "14px",
                      textAlign: "start",
                    }}
                  >
                    {formik.errors.comment}
                  </Typography>
                )}
              </form>
            )}

            <div className="mt-4">
              {commentData &&
                commentData?.map((e, i) => <Message data={e} key={i} getComments={getComments}/>)}
            </div>
          </div>


        </div>
      </div>
      {modal === "reply" ? <Reply close={hide}/> : null}
      {modal === "slipage" ? <Slipage close={hide} /> : null}
    </>
  );
};

export default page;
