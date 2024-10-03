"use client";
import style from "../../../style/inside.module.css";
import { Box, Button, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import { useAccount } from "wagmi";
import { Reply } from "@mui/icons-material";
import { API_URL } from "@/src/Config";
import { ContractContext } from "@/src/Context/ContractContext";
import { useParams } from "next/navigation";
import Link from "next/link";


const ReplyMessage = ({ data, index, mainReplyId, getReplyComments,getComments}) => {
  const { id: projectId } = useParams()
  const { isConnected } = useAccount()

  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState([]);
  const [likeActive, setActiveLike] = useState(false)
  const [dislikes, setDislikes] = useState([]);
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(`${API_URL}/delete/comment/${data?._id}`);

      if (response.status === 200) {
        getReplyComments()
        getComments()
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const getLikesByCommentId = async () => {
    await axios({
      method: "GET",
      url: `${API_URL}/likes/comment/${data?._id}`,
      headers: {
        "Accept-Encoding": "application/json",
        // 'Origin' : process.env.ORIGIN
      },
    })
      .then((_data) => {
        setLikes(_data.data.likes);
        setDislikes(_data.data.dislikes);
      })
      .catch((err) => {
        setLikes([]);
        setDislikes([]);

      });
  };

  const createLike = async (like) => {
    try {
      const config = {
        headers: {
          "x-access-token": localStorage.getItem("access_token"),
        },
      };
      const res = await axios.post(
        `${API_URL}/create/like`,
        {
          commentId: data?._id,
          like: like,
        },
        config
      );
      if (res.status === 201) {
        getLikesByCommentId()
      }
      if (res.status === 200) {
        getLikesByCommentId()
      }
    } catch (error) {
      // console.log(error);
    }
  };
  useEffect(() => {
    if (data?._id) {
      getLikesByCommentId()
    }
  }, [data?._id])
  return (
    <Box className={style.comment_card} sx={{
      ml: "3rem"
    }}>
      <div className="d-flex flex-column flex-sm-row justify-content-between">
        <div className="d-flex gap-2">
          {!data?.userId?.image ? (
            <img src="/assets/demo1-hero.png" alt="" />
          ) : (
            <Typography
              component={"img"}
              src={data?.userId?.image}
              alt=""
              width={"50px"}
              height={"50px"}
              borderRadius={"100%"}
            />
          )}
          <div>
            <h4>
              <Link
                href="/profile/userId"
                className="text-decoration-none"
                style={{ color: "var(--dark)" }}
              >
                {data?.userId?.username}
              </Link>
            </h4>
            <div className="d-flex gap-2 align-items-center">
              <p className="mb-0 opacity-75">
                {new Date(data?.createdAt).toLocaleDateString()}
              </p>
              <div className="d-flex d-sm-none align-items-center gap-sm-4 gap-2">
                <div className="d-flex gap-2 align-items-center">
                  <button className={`${style.minibtn} ms-0 btn2 px-sm-3 px-1 py-sm-2 py-1 ${likeActive ? "activelike" : ""}`}
                    onClick={() => {
                      createLike(true)
                      setActiveLike(!likeActive)
                    }

                    }>Likes</button>
                  <p className="opacity-50 fw-bold mb-0">{likes?.length}</p>
                </div>
                {isConnected && (
                  <button className="border-0 p-0 fw-semibold bg-transparent" 
                    style={{
                      fontSize:"14px",
                      color: "var(--main_color)"
                    }}
                  onClick={handleClickOpen}>Reply</button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="d-sm-flex d-none align-items-center gap-sm-4 gap-3">
          <div className="d-flex gap-2 align-items-center">
            <button className={`${style.minibtn} btn2 px-sm-3 px-1 py-sm-2 py-1 ${likeActive ? "activelike" : ""}`}
              onClick={() => {
                createLike(true)
                setActiveLike(!likeActive)
              }

              }>Likes</button>
            <p className="opacity-50 fw-bold mb-0">{likes?.length}</p>
          </div>
          {isConnected && (
            <button onClick={handleClickOpen}>Reply</button>
          )}
        </div>
      </div>
      <Box sx={{
        pt: "0.8rem"
      }}>
        {data?.image && <Typography
          component={"img"}
          src={data?.image}
          alt=""
          width={"100px"}
          height={"100px"}
        />}
        <p className="opacity-50 mt-2">{data?.comment}</p>
      </Box>

      {open ? <Reply close={handleClose} getReplyComments={getReplyComments}
        commentId={mainReplyId} /> : null}
    </Box>
  );
};

export default ReplyMessage;
