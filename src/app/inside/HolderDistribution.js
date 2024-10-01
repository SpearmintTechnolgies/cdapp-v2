"use client";

import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { erc20Abi, formatEther, parseEther } from "viem";
import { useAccount, useBalance, useBlockNumber, useReadContract } from "wagmi";
import { API_URL, EXPLORE_URL, POOL_ADDRESS } from "../../Config";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const HolderDistribution = ({ i, e,tokenAdd}) => {
    const [userData, setUserData] = useState({});
    const queryClient = useQueryClient();
    const { data: blockNumber } = useBlockNumber({ watch: true });
    const { address } = useAccount();
    const { data: getTokenBal, queryKey: getTokenBalQueryKey } = useReadContract({
      address: tokenAdd,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [e?.user],
    });
  
    const { data: supply, queryKey: getTokenSupplyQueryKey } = useReadContract({
      address: tokenAdd,
      abi: erc20Abi,
      functionName: "totalSupply"
    });
    
    // console.log("supply",supply));
    
    useEffect(() => {
      if (getTokenSupplyQueryKey) {
        queryClient.invalidateQueries({ queryKey: getTokenSupplyQueryKey });
      }
    }, [blockNumber, queryClient, getTokenSupplyQueryKey]);
  
    useEffect(() => {
      if (getTokenBalQueryKey) {
        queryClient.invalidateQueries({ queryKey: getTokenBalQueryKey });
      }
    }, [blockNumber, queryClient, getTokenBalQueryKey]);
    const getUserByAddress = async () => {
      await axios({
        method: "GET",
        url: `${API_URL}/get/user/${e?.user}`,
        headers: {
          "Accept-Encoding": "application/json",
          "x-access-token": localStorage.getItem("access_token"),
        },
      })
        .then((_data) => {
          setUserData(_data.data.user);
        })
        .catch((err) => {
          //  throw err
          console.log(err);
        });
    };
    useEffect(() => {
      getUserByAddress();
    }, [e?.user]);
  
    function getFormattedTokenBalance() {
      // Convert the token balance to ether and then to percentage
      // alert(parseEther(parseInt(supply)))
      // console.log("formatEther(supply)",formatEther(supply));
      
      let percentage = parseFloat(
        (formatEther(getTokenBal || 0) / (supply ? formatEther(supply) : parseInt(100000))) * 100
      ).toFixed(2);
  
      // Check if the percentage is very small (e.g., less than 1e-6)
      if (percentage < 1e-3) {
        percentage = 0;
      }
  
      return percentage;
    }
  return (
    <li>
      <div className="d-flex gap-2 justify-content-between">
        <p>  <Typography
        component={"a"}
        sx={{ color: "inherit", textDecoration: "none" }}
        target="_blank"
        href={`${EXPLORE_URL}/${e?.user}`}
      >
        {" "}
        {userData?.username?.length > 8
          ? `${userData?.username.slice(0, 4)}...${userData?.username.slice(
              -4
            )}`
          : userData?.username}{" "}
        ({e?.user ? `${e?.user.slice(0, 6)}...${e?.user.slice(-4)}` : ""})
      </Typography></p>
        <p>{getFormattedTokenBalance()} %</p>
      </div>
    </li>
  );
};

export default HolderDistribution;
