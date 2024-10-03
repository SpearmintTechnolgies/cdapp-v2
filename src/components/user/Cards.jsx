"use client";
import { Typography } from "@mui/material";
import style from "../../style/user.module.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import React, { useEffect, useState } from "react";
import { API_URL } from "@/src/Config";
import axios from "axios";
import Link from "next/link";
export const LeftCard = ({ data }) => {
  return (
    <>
      <div
        className={
          style.leftcard +
          " my-3 d-flex align-items-start justify-content-between"
        }
      >
        <div className="d-flex gap-2 align-items-center">
          <Typography
            component={"img"}
            src={data?.image}
            sx={{
              my: "0.5rem",
              borderRadius: "50%",
              width: "57px",
              height: "57px",
              border: "1px solid rgb(255 255 255 / 50%)",
            }}
          />
          <div>
            <h6>{data?.name}</h6>
            <p className="mb-0">Market cap: ${data?.marketValue > 0
                  ? parseFloat(data?.marketValue).toFixed(2)
                  : 0}</p>
          </div>
        </div>
        {/* <button>Refresh</button> */}
      </div>
    </>
  );
};

export const RightCard = ({ data}) => {
  console.log(data);
  
  const [user, setUser] = useState({});
  const getUser = async () => {
    try {
      const config = {
        headers: {
          "x-access-token": localStorage.getItem("access_token"),
        },
      };
      const res = await axios.get(`${API_URL}/get/single/user/${data?.followerId}`, config);
      if (res.status === 200) {
        setUser(res.data.user);
        // localStorage.setItem("username", res.data.user.username);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(()=>{
    getUser()
  },[data?.followerId])
  const [followers, setFollowers] = useState([]);
  const getFollowers = async () => {
    try {
      //   const config = {
      //     headers: {
      //       "x-access-token": localStorage.getItem("access_token"),
      //     },
      //   };
      const res = await axios.get(
        `${API_URL}/get/followers/${data?.userId}`
      );
      if (res.status === 200) {
        setFollowers(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (data) {
      getFollowers();
    }
  }, [data]);
  return (
 <Link href={`/profile/${user?._id}`} className="text-decoration-none" style={{ color: "var(--dark)" }}>
     <div className={style.rightcard + " my-3 d-flex align-items-center justify-content-between"}>
      <div className="d-flex gap-2 align-items-center">
        {user?.image ? (
          <Typography
            component={"img"}
            src={user?.image}
            sx={{
              my: "0.5rem",
              borderRadius: "10px",
              width: "45px",
              height: "45px",
              border: "1px solid rgb(255 255 255 / 50%)",
            }}
          />
        ) : (
          <AccountCircleIcon
            sx={{
              fontSize: "4rem",
              color: "#ccbcbc",
            }}
          />
        )}
        <div>
          <h6> @{user?.username}</h6>
          <p className="mb-0">
            {" "}
            {user?.address
              ? `${user?.address.slice(0, 8)}...${user?.address.slice(-4)}`
              : ""}
          </p>
        </div>
      </div>
      <p className="mb-0 fw-semiblod fs-6 opacity-75">{followers?.length} followers</p>
    </div>
 </Link>
  );
};
