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

  const handleOnchange = (e) => {
    setBuyErr("");
    const value = e.target.value;
    if (value >= 0) {
      setBuyValue(value);
    }
  };
  const [sellValue, setSellValue] = useState("0");
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

  // const { data: projects } = useReadContract({
  //   abi: TOKEN_COIN_ABI,
  //   address: POOL_ADDRESS,
  //   functionName: "projects",
  //   args: [projectId],
  // });
  // const { data: getTokensForAmount } = useReadContract({
  //   abi: TOKEN_COIN_ABI,
  //   address: POOL_ADDRESS,
  //   functionName: "getBuyTokens",
  //   args: [projectId, projects?.[7], parseEther(buyValue.toString())],
  // });

  // const { data: getSellTokens } = useReadContract({
  //   abi: TOKEN_COIN_ABI,
  //   address: POOL_ADDRESS,
  //   functionName: "getSellTokens",
  //   args: [projectId, projects?.[7], parseEther(sellValue.toString())],
  // });

  // const { data: getBuyFee } = useReadContract({
  //   abi: TOKEN_COIN_ABI,
  //   address: POOL_ADDRESS,
  //   functionName: "getBuyFee",
  //   args: [parseEther(buyValue.toString()), projects?.[7]],
  // });

  // const { data: getSellFee } = useReadContract({
  //   abi: TOKEN_COIN_ABI,
  //   address: POOL_ADDRESS,
  //   functionName: "getSellFee",
  //   args: [parseEther(sellValue.toString()), projects?.[7]],
  // });


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

  // const buyTokenWriteAsync = async () => {
  //   if (buyValue === "") {
  //     setBuyErr("Please enter value");
  //     return;
  //   }
  //   // alert(
  //   //   parseFloat(buyValue) >
  //   //   formatEther(
  //   //     tokenData?.isToken == true ? alternateTokenBalance : balance?.value
  //   //   )
  //   // );
  //   // if (
  //   //   parseFloat(buyValue) >
  //   //   formatEther(
  //   //     tokenData?.isToken == true ? alternateTokenBalance : balance?.value
  //   //   )
  //   // ) {
  //   //   setBuyErr("Insufficient balance");
  //   //   return;
  //   // }
  //   const config = {
  //     address: POOL_ADDRESS,
  //     abi: TOKEN_COIN_ABI,
  //     functionName: "buyTokens",
  //     args: [projectId, parseEther(buyValue.toString()),slippage*100, getTokensForAmount?.[0]],
  //     value:
  //       projects?.[7] === false
  //         ? parseEther(buyValue.toString()) + getBuyFee
  //         : 0,
  //     // value: 0,
  //   };
  //   setBuyTxn(null);
  //   try {
  //     setBuyIsloading(true);
  //     const txn = await writeContractAsync?.(config);
  //     setBuyTxn(txn);
  //   } catch (e) {
  //     setBuyIsloading(false);
  //     console.log(e);
  //   }
  // };
  // const {
  //   isLoading: isLoadingBuyWait,
  //   isSuccess: isSuccessBuyWait,
  //   data: buyToken,
  // } = useWaitForTransactionReceipt({
  //   hash: buyTxn,
  // });

  // const sellTokenWriteAsync = async () => {
  //   if (sellValue === "") {
  //     setSellErr("Please enter value");
  //     return;
  //   }
  //   // alert(parseFloat(sellValue))
  //   // alert(parseFloat(formatEther(tokenBalance || 0)))
  //   // alert(parseFloat(sellValue) > parseFloat(formatEther(tokenBalance || 0)))
  //   if (parseFloat(sellValue) > parseFloat(formatEther(tokenBalance || 0)) && parseFloat(formatEther(tokenBalance) * 1).toFixed(6) != sellValue) {
  //     setSellErr("Insufficient token balance");
  //     return;
  //   }
  //   const config = {
  //     address: POOL_ADDRESS,
  //     abi: TOKEN_COIN_ABI,
  //     functionName: "sellTokens",
  //     args: [projectId, parseFloat(formatEther(tokenBalance) * 1).toFixed(6) == sellValue ? tokenBalance : parseEther(sellValue?.toString()) , slippage*100 , getSellTokens?.[0] ],
  //     value: 0,
  //   };
  //   setSellTxn(null);
  //   try {
  //     setSellIsloading(true);
  //     const txn = await writeContractAsync?.(config);
  //     setSellTxn(txn);
  //   } catch (e) {
  //     setSellIsloading(false);
  //     console.log(e);
  //   }
  // };
  // const {
  //   isLoading: isLoadingSellWait,
  //   isSuccess: isSuccessSellWait,
  //   data: sellToken,
  // } = useWaitForTransactionReceipt({
  //   hash: sellTxn,
  // });
  // useEffect(() => {
  //   if (isSuccessSellWait || isSuccessBuyWait) {
  //     setBuyValue("0");
  //     setSellValue("0");
  //     getCrown();
  //     getCoin()
  //     getHolderDistribution(projectId)
  //     // alert("above")
  //     getTokenChartDetail(projectId)
  //     // alert("below")
  //     getTokenDetail(projectId)
  //   }
  // }, [isSuccessSellWait, isSuccessBuyWait]);

  // const approveWriteAsync = async () => {
  //   const approveAmount = parseEther(sellValue);
  //   const config = {
  //     address: tokenData?.address,
  //     abi: erc20Abi,
  //     functionName: "approve",
  //     args: [POOL_ADDRESS, tokenBalance],
  //   };
  //   setApproveTxn(null);
  //   try {
  //     setApproveIsloading(true);
  //     const txn = await writeContractAsync?.(config);
  //     setApproveTxn(txn);
  //   } catch (e) {
  //     setApproveIsloading(false);
  //     console.log(e);
  //   }
  // };
  // const {
  //   isLoading: isLoadingApproveWait,
  //   isSuccess: isSuccessApproveWait,
  //   data: approveData,
  // } = useWaitForTransactionReceipt({
  //   hash: approveTxn,
  // });
  // const alternateApproveWriteAsync = async () => {
  //   const alternateApproveAmount = "1000000000000000000000";
  //   const config = {
  //     address: alternateToken,
  //     abi: erc20Abi,
  //     functionName: "approve",
  //     args: [POOL_ADDRESS, alternateApproveAmount.toString()],
  //   };
  //   setAlternateApproveTxn(null);
  //   try {
  //     setAlternateApproveIsloading(true);
  //     const txn = await writeContractAsync?.(config);
  //     setAlternateApproveTxn(txn);
  //   } catch (e) {
  //     setAlternateApproveIsloading(false);
  //     console.log(e);
  //   }
  // };
  // const {
  //   isLoading: isLoadingAlternateApproveWait,
  //   isSuccess: isSuccessAlternateApproveWait,
  //   data: alternateApproveData,
  // } = useWaitForTransactionReceipt({
  //   hash: alternateApproveTxn,
  // });
  // useEffect(() => {
  //   if (
  //     balanceQueryKey ||
  //     tokenBalanceQueryKey ||
  //     allowanceQueryKey ||
  //     alternateTokenBalanceQueryKey ||
  //     alternateTokenAllowanceQueryKey || isSuccessSellWait || isSuccessBuyWait
  //   ) {
  //     queryClient.invalidateQueries({ queryKey: balanceQueryKey });
  //     queryClient.invalidateQueries({ queryKey: tokenBalanceQueryKey });
  //     queryClient.invalidateQueries({ queryKey: allowanceQueryKey });
  //     queryClient.invalidateQueries({
  //       queryKey: alternateTokenAllowanceQueryKey,
  //     });
  //     queryClient.invalidateQueries({
  //       queryKey: alternateTokenBalanceQueryKey,
  //     });
  //   }
  // }, [
  //   blockNumber,
  //   queryClient,
  //   balanceQueryKey,
  //   tokenBalanceQueryKey,
  //   allowanceQueryKey,
  //   alternateTokenAllowanceQueryKey,
  //   alternateTokenBalanceQueryKey,
  //   isSuccessSellWait,
  //   isSuccessBuyWait
  // ]);
  return (
    <>
   
   
      {modal === "slipage" ? <Slipage slippage={slippage} setSlippage={setSlippage} close={hide} /> : null}
    </>
  );
};

export default TradeContainer;