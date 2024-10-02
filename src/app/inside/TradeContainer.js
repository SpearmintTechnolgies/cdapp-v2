"use client";
import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import style from "../../style/inside.module.css";
import {
  useAccount,
  useBalance,
  useBlockNumber,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { API_URL, POOL_ADDRESS } from "../../Config";
import TOKEN_COIN_ABI from "../../Config/TOKEN_COIN_ABI.json";
import { formatEther, parseEther, erc20Abi } from "viem";
import { useQueryClient } from "@tanstack/react-query";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { ContractContext } from "../../Context/ContractContext";
import axios from "axios";
import { useParams } from "next/navigation";
import { Slipage } from "@/src/components/modals/Slipage";

const TradeContainer = ({ tokenData, getHolderDistribution, getTokenChartDetail, getTokenDetail }) => {
  const { id: projectId } = useParams();
  const { openConnectModal } = useConnectModal();
  const [modal, setModal] = useState(null);
  const hide = () => {
    setModal(null);
  };
  const { coinData, getCrown, getCoin } = useContext(ContractContext);
  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const [buyValue, setBuyValue] = useState("0");
  const [buyErr, setBuyErr] = useState("");
  const [show, setShow] = useState(false);

  const [coinTokenSymbol, setCoinTokenSymbol] = useState("CORE");
  const [sellValue, setSellValue] = useState("0");

  const handleOnchange = (e) => {
    setBuyErr("");
    // alert(e)
    const value = e.target.value;
    if (value >= 0) {
      // alert(value)
      setBuyValue(value);
    }
  };
  const [sellErr, setSellErr] = useState("");
  const handleSellOnchange = (e) => {
    setSellErr("");
    const value = e.target.value;
    if (value >= 0) {
      setSellValue(value);
    }
  };
  const handleReset = (e) => {
    setBuyValue(0);
    setSellValue(0);
  };
  const { address, isConnected } = useAccount();
  const { data: balance, queryKey: balanceQueryKey } = useBalance({
    address: address,
  });
  
  
  const { data: TOTAL_RAISE } = useReadContract({
    abi: TOKEN_COIN_ABI,
    address: POOL_ADDRESS,
    functionName: "TOTAL_RAISE",
    args: [],
  });
  const { data: alternateToken } = useReadContract({
    abi: TOKEN_COIN_ABI,
    address: POOL_ADDRESS,
    functionName: "alternateToken",
    args: [],
  });

  const { data: alternateTokenSymbol } = useReadContract({
    abi: erc20Abi,
    address: alternateToken,
    functionName: "symbol",
    args: [],
  });
  useEffect(() => {
    if (alternateTokenSymbol !== undefined && tokenData?.isToken === true) {
      setCoinTokenSymbol(alternateTokenSymbol);
    }
  }, [alternateTokenSymbol]);
  const { data: tokenBalance, queryKey: tokenBalanceQueryKey } =
    useReadContract({
      address: tokenData?.address,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [address],
    });
  // console.log("tokenBalance",formatEther(tokenBalance));

  const {
    data: alternateTokenBalance,
    queryKey: alternateTokenBalanceQueryKey,
  } = useReadContract({
    address: alternateToken,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address],
  });

  const { data: allowance, queryKey: allowanceQueryKey } = useReadContract({
    abi: erc20Abi,
    address: tokenData?.address,
    functionName: "allowance",
    args: [address, POOL_ADDRESS],
  });
  const {
    data: alternateTokenAllowance,
    queryKey: alternateTokenAllowanceQueryKey,
  } = useReadContract({
    abi: erc20Abi,
    address: alternateToken,
    functionName: "allowance",
    args: [address, POOL_ADDRESS],
  });

  const { data: projects ,  queryKey: projectsQueryKey} = useReadContract({
    abi: TOKEN_COIN_ABI,
    address: POOL_ADDRESS,
    functionName: "projects",
    args: [projectId],
  });

  console.log("projects",projects);
  console.log("POOL_ADDRESS",POOL_ADDRESS);
  
  console.log("buyValue",buyValue);
  
  const { data: getTokensForAmount } = useReadContract({
    abi: TOKEN_COIN_ABI,
    address: POOL_ADDRESS,
    functionName: "getBuyTokens",
    args: [projectId, projects?.[7], buyValue == "0" ? "0" : buyValue*1e18],
  });
  


  const { data: getSellTokens,  queryKey: getSellTokensQueryKey  } = useReadContract({
    abi: TOKEN_COIN_ABI,
    address: POOL_ADDRESS,
    functionName: "getSellTokens",
    args: [projectId, projects?.[7], sellValue == "0" ? "0" : sellValue*1e18],
  });

  const { data: getBuyFee , queryKey: getBuyFeeQueryKey } = useReadContract({
    abi: TOKEN_COIN_ABI,
    address: POOL_ADDRESS,
    functionName: "getBuyFee",
    args: [ buyValue == "0" ? "0" : buyValue*1e18, projects?.[7]],
  });

  const { data: getSellFee , queryKey: getSellFeeQueryKey } = useReadContract({
    abi: TOKEN_COIN_ABI,
    address: POOL_ADDRESS,
    functionName: "getSellFee",
    args: [sellValue == "0" ? "0" : sellValue*1e18, projects?.[7]],
  });


  const { writeContractAsync } = useWriteContract();
  const [approveTxn, setApproveTxn] = useState("");
  const [alternateApproveTxn, setAlternateApproveTxn] = useState("");
  const [approveIsLoading, setApproveIsloading] = useState("");
  const [alternateApproveIsLoading, setAlternateApproveIsloading] =
    useState("");
  const [buyTxn, setBuyTxn] = useState("");
  const [slippage, setSlippage] = useState(5);
  const [buyIsLoading, setBuyIsloading] = useState("");
  const [sellTxn, setSellTxn] = useState("");
  const [sellIsLoading, setSellIsloading] = useState("");

  const buyTokenWriteAsync = async () => {
    if (buyValue === "") {
      setBuyErr("Please enter value");
      return;
    }
    // alert(
    //   parseFloat(buyValue) >
    //   formatEther(
    //     tokenData?.isToken == true ? alternateTokenBalance : balance?.value
    //   )
    // );
    // if (
    //   parseFloat(buyValue) >
    //   formatEther(
    //     tokenData?.isToken == true ? alternateTokenBalance : balance?.value
    //   )
    // ) {
    //   setBuyErr("Insufficient balance");
    //   return;
    // }
    const config = {
      address: POOL_ADDRESS,
      abi: TOKEN_COIN_ABI,
      functionName: "buyTokens",
      args: [projectId, parseEther(buyValue.toString()),slippage*100, getTokensForAmount?.[0]],
      value:
        projects?.[7] === false
          ? parseEther(buyValue.toString()) + getBuyFee
          : 0,
      // value: 0,
    };
    setBuyTxn(null);
    try {
      setBuyIsloading(true);
      const txn = await writeContractAsync?.(config);
      setBuyTxn(txn);
    } catch (e) {
      setBuyIsloading(false);
      console.log(e);
    }
  };
  const {
    isLoading: isLoadingBuyWait,
    isSuccess: isSuccessBuyWait,
    data: buyToken,
  } = useWaitForTransactionReceipt({
    hash: buyTxn,
  });

  const sellTokenWriteAsync = async () => {
    if (sellValue === "") {
      setSellErr("Please enter value");
      return;
    }
    // alert(parseFloat(sellValue))
    // alert(parseFloat(formatEther(tokenBalance || 0)))
    // alert(parseFloat(sellValue) > parseFloat(formatEther(tokenBalance || 0)))
    if (parseFloat(sellValue) > parseFloat(formatEther(tokenBalance || 0)) && parseFloat(formatEther(tokenBalance) * 1).toFixed(6) != sellValue) {
      setSellErr("Insufficient token balance");
      return;
    }
    const config = {
      address: POOL_ADDRESS,
      abi: TOKEN_COIN_ABI,
      functionName: "sellTokens",
      args: [projectId, parseFloat(formatEther(tokenBalance) * 1).toFixed(6) == sellValue ? tokenBalance : parseEther(sellValue?.toString()) , slippage*100 , getSellTokens?.[0] ],
      value: 0,
    };
    setSellTxn(null);
    try {
      setSellIsloading(true);
      const txn = await writeContractAsync?.(config);
      setSellTxn(txn);
    } catch (e) {
      setSellIsloading(false);
      console.log(e);
    }
  };
  const {
    isLoading: isLoadingSellWait,
    isSuccess: isSuccessSellWait,
    data: sellToken,
  } = useWaitForTransactionReceipt({
    hash: sellTxn,
  });
  useEffect(() => {
    if (isSuccessSellWait || isSuccessBuyWait) {
      setBuyValue("0");
      setSellValue("0");
      getCrown();
      getCoin()
      getHolderDistribution(projectId)
      // alert("above")
      getTokenChartDetail(projectId)
      // alert("below")
      getTokenDetail(projectId)
    }
  }, [isSuccessSellWait, isSuccessBuyWait]);

  const approveWriteAsync = async () => {
    const approveAmount = parseEther(sellValue);
    const config = {
      address: tokenData?.address,
      abi: erc20Abi,
      functionName: "approve",
      args: [POOL_ADDRESS, tokenBalance],
    };
    setApproveTxn(null);
    try {
      setApproveIsloading(true);
      const txn = await writeContractAsync?.(config);
      setApproveTxn(txn);
    } catch (e) {
      setApproveIsloading(false);
      console.log(e);
    }
  };
  const {
    isLoading: isLoadingApproveWait,
    isSuccess: isSuccessApproveWait,
    data: approveData,
  } = useWaitForTransactionReceipt({
    hash: approveTxn,
  });
  const alternateApproveWriteAsync = async () => {
    const alternateApproveAmount = "1000000000000000000000";
    const config = {
      address: alternateToken,
      abi: erc20Abi,
      functionName: "approve",
      args: [POOL_ADDRESS, alternateApproveAmount.toString()],
    };
    setAlternateApproveTxn(null);
    try {
      setAlternateApproveIsloading(true);
      const txn = await writeContractAsync?.(config);
      setAlternateApproveTxn(txn);
    } catch (e) {
      setAlternateApproveIsloading(false);
      console.log(e);
    }
  };
  const {
    isLoading: isLoadingAlternateApproveWait,
    isSuccess: isSuccessAlternateApproveWait,
    data: alternateApproveData,
  } = useWaitForTransactionReceipt({
    hash: alternateApproveTxn,
  });
  useEffect(() => {
    if (
      balanceQueryKey ||
      tokenBalanceQueryKey ||
      allowanceQueryKey ||
      alternateTokenBalanceQueryKey ||
      alternateTokenAllowanceQueryKey || isSuccessSellWait || isSuccessBuyWait
    ) {
      queryClient.invalidateQueries({ queryKey: balanceQueryKey });
      queryClient.invalidateQueries({ queryKey: tokenBalanceQueryKey });
      queryClient.invalidateQueries({ queryKey: allowanceQueryKey });
      queryClient.invalidateQueries({
        queryKey: alternateTokenAllowanceQueryKey,
      });
      queryClient.invalidateQueries({
        queryKey: alternateTokenBalanceQueryKey,
      });
    }
  }, [
    blockNumber,
    queryClient,
    balanceQueryKey,
    tokenBalanceQueryKey,
    allowanceQueryKey,
    alternateTokenAllowanceQueryKey,
    alternateTokenBalanceQueryKey,
    isSuccessSellWait,
    isSuccessBuyWait
  ]);
  return (
    <>
     <div className={" mb-2"}>
        <div className={style.tabbtn + " mb-2"}>
          <button
            className={!show ? "border-0 activefilter me-2" : "border-0 me-2"}
            onClick={() => setShow(false)}
          >
            Buy
          </button>
          <button
            className={show ? "border-0 activefilter" : "border-0"}
            onClick={() => setShow(true)}
          >
            Sell
          </button>
        </div>
        {/* <Box
          sx={{
            display: "flex",
            gap: "0.5rem",
          }}
        >
          <Button
            className={`button buy ${!show ? "active" : ""}`}
            onClick={() => setShow(false)}
          >
            Buy
          </Button>
          <Button
            className={`button sell ${show ? "active" : ""}`}
            onClick={() => setShow(true)}
          >
            Sell
          </Button>
        </Box> */}
        {/* {!show ? <div className="d-flex justify-content-between align-items-center mt-4"> */}
          {/* <button className="border-0 fw-bold"
            style={{
              background: "var(--light)",
              borderRadius: "5px",
              color: "var(--dark)",
              opacity: ".7",
              fontSize: "12px"
            }}
          >Switch to {tokenData?.symbol}</button>  */}
          {/* <div>
            <button className="btn1" onClick={() => setBuyValue(tokenData?.isToken == true
              ? formatEther(alternateTokenBalance || 0)
              : parseFloat(formatEther(balance?.value || 0)).toFixed(3))}>Max</button>
            <button className="border-0 bg-transparent" style={{ color: "var(--dark)", opacity: ".7" }} onClick={() => setModal("slipage")}>
              <svg xmlns="http://www.w3.org/2000/svg" width={"20px"} fill="currentcolor" height={"20px"} viewBox="0 0 512 512"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" /></svg>
            </button>
          </div>   */}
        {/* </div> : null} */}
        <Box
          sx={{
            mt: "2rem",
            mb: ".7rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* <Button className="reset_btn">Swap</Button> */}


            <Typography
            sx={{
              fontSize: "14px",
              color: "var(--dark)",
              fontWeight: "600",
              opacity: ".7",
            }}
          >
         
            Bal:{" "}
          {show
              ? tokenBalance
                ? parseFloat(formatEther(tokenBalance)).toFixed(6)
                : 0
              : tokenData?.isToken == true
                ? formatEther(alternateTokenBalance || 0)
                : parseFloat(formatEther(balance?.value || 0)).toFixed(3)}{" "}
            {show
              ? tokenData?.symbol || "CORE"
              : tokenData?.isToken == true
                ? alternateTokenSymbol
                : balance?.symbol}
          </Typography>
          <div className="d-flex align-items-center gap-2">
            {!show ? <button className="btn1" onClick={() => setBuyValue(tokenData?.isToken == true
              ? formatEther(alternateTokenBalance || 0)
              : parseFloat(balance?.value > (TOTAL_RAISE -  projects?.[6]) ? formatEther((TOTAL_RAISE -  projects?.[6]) || 0) : parseFloat(formatEther(balance?.value || 0) - (formatEther(balance?.value || 0)*0.025) )).toFixed(18))}>Max</button> : null}
            <button className="border-0 bg-transparent p-0 d-flex align-items-center" style={{ color: "var(--dark)", opacity: ".7" }} onClick={() => setModal("slipage")}>
              <svg xmlns="http://www.w3.org/2000/svg" width={"20px"} fill="currentcolor" height={"20px"} viewBox="0 0 512 512"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" /></svg>
            </button>
          </div>  
        </Box>
        <div className={style.inputfield + " d-flex"}>
          <input
            type="number"
            value={show ? sellValue : buyValue}
            onChange={show ? handleSellOnchange : handleOnchange}
            placeholder="Enter value"
          />
          <button className="d-flex gap-1 border-0 bg-white p-1">
            <Typography
              sx={{
                display: "flex",
                gap: "0.2rem",
                alignItems: "center",
                color: "#000",
                lineHeight:"19px"
                //   fontFamily: "latoBold",
                //   border: "1px solid #6F6F6F",
                //   p: "5px",
                //   borderRadius: "3px",
              }}
            >
              <Typography
                component={"img"}
                src={"/assets/bnb.png"}
                width={"20px"}
              />
              {show ? tokenData?.symbol : coinTokenSymbol}
              {/* tokenData?.isToken === false
              ? "TBNB"
              : "USDT" */}
            </Typography>
          </button>
        </div>
        {!show ? <div className={style.btn_group+" d-flex gap-2 mt-2"} > 
          <button className=" px-1" style={{ fontSize: "14px" }} onClick={() => setBuyValue("25")}>25 CORE</button>
          <button className=" px-1" style={{ fontSize: "14px" }} onClick={() => setBuyValue("50")}>50 CORE</button>
          <button className=" px-1" style={{ fontSize: "14px" }} onClick={() => setBuyValue("200")}>200 CORE</button>
        </div> :
          <div className={style.btn_group+" d-flex gap-2 mt-2"} >
            <button className="px-1" style={{ fontSize: "14px" }} onClick={() => setSellValue(parseFloat(formatEther(tokenBalance) * 0.25).toFixed(18))} >25 %</button>
            <button className=" px-1" style={{ fontSize: "14px" }} onClick={() => setSellValue(parseFloat(formatEther(tokenBalance) * 0.50).toFixed(18))}>50 %</button>
            <button className=" px-1" style={{ fontSize: "14px" }} onClick={() => setSellValue(parseFloat(formatEther(tokenBalance) * 0.75).toFixed(18))}>75 %</button>
            <button className=" px-1" style={{ fontSize: "14px" }} onClick={() => setSellValue(parseFloat((formatEther(tokenBalance) * 1) - parseFloat("0.1")).toFixed(18))}>100 %</button>
          </div>
        }
        {buyErr && (
          <Typography
            sx={{
              //   fontFamily: "lato",
              fontSize: "15px",
              color: "red",
            }}
          >
            {buyErr}
          </Typography>
        )}
        {sellErr && (
          <Typography
            sx={{
              //   fontFamily: "lato",
              fontSize: "15px",
              color: "red",
            }}
          >
            {sellErr}
          </Typography>
        )}
        <Box
          mt={"0.5rem"}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* <button
            className="border-0 opacity-75 bg-transparent p-0"
            onClick={() => setModal("slipage")}
            style={{ color: "var(--dark)", fontSize: "15px" }}
          >
            Set max slippage
          </button> */}
          {/* {formatEther(getTokensForAmount)} */}
          {show ? (
            <Typography
              sx={{
                fontSize: "14px",
                color: "var(--dark)",
                fontWeight: "600",
                opacity: ".7",
              }}
            >
              {getSellTokens && sellValue != ""
                ? parseFloat(formatEther(getSellTokens?.[0])).toFixed(6)
                : 0}{" "}
              {/* {tokenData?.isToken === false ? "TBNB" : "USDT"} */}
              {coinTokenSymbol}
            </Typography>
          ) : (
            <Typography
              sx={{
                fontSize: "14px",
                color: "var(--dark)",
                fontWeight: "600",
                opacity: ".7",
              }}
            >

              {getTokensForAmount && buyValue != ""
                ? parseFloat(formatEther(getTokensForAmount?.[0])).toFixed(6)
                : 0}{" "}
              {/* {tokenData?.isToken === false ? "TBNB" : "USDT"} */}
              {tokenData?.symbol}
            </Typography>
          )}
        </Box>

        <Box>


          {isConnected ? (
            show && sellValue > 0 && allowance < (parseFloat(sellValue).toFixed(6) == parseFloat(formatEther(tokenBalance)).toFixed(6) ? tokenBalance : parseEther(sellValue > 0 ? sellValue : 0)) ? (
              <button
                className="btn1 py-2 w-100 mt-4"
                onClick={() => approveWriteAsync?.()}
              >
                {approveIsLoading && !isSuccessApproveWait
                  ? "Loading.."
                  : `Approve ${tokenData?.symbol}`}
              </button>
            ) : tokenData?.isToken == true && alternateTokenAllowance == "0" ? (
              <button
                className="btn1 py-2 w-100 mt-4"
                onClick={() => alternateApproveWriteAsync?.()}
              >
                {alternateApproveIsLoading && !isSuccessAlternateApproveWait
                  ? "Loading.."
                  : `Approve ${alternateTokenSymbol}`}
              </button>
            ) : (
              <button
                className="btn1 py-2 w-100 mt-4"
                onClick={
                  show
                    ? () => sellTokenWriteAsync()
                    : () => buyTokenWriteAsync()
                }
                disabled={show ? sellValue === 0 : buyValue === 0}
              >
                {show
                  ? sellIsLoading && !isSuccessSellWait
                    ? "Loading.."
                    : "Sell Trade"
                  : buyIsLoading && !isSuccessBuyWait
                    ? "Loading.."
                    : "Buy Trade"}
              </button>
            )
          ) : (
            <Box
              // my="3rem"
              mt="1.5rem"
              sx={{
                "& button": {
                  width: "100% !important",
                  textAlign: "center !important",
                  border: "1px solid  !important",
                  borderRadius: "6px !important",
                  "&:hover": {
                    opacity: "0.9",
                  },
                },
              }}
            >
              <button className="btn1 py-2 w-100" onClick={openConnectModal}>Connect</button>
            </Box>
          )}
        </Box>  
      </div>
   
      {modal === "slipage" ? <Slipage slippage={slippage} setSlippage={setSlippage} close={hide} /> : null}
    </>
  );
};

export default TradeContainer;