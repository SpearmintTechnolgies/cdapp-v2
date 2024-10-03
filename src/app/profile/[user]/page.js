"use client";
import style from "../../../style/user.module.css";
import { useContext, useEffect, useState } from "react";
import { CoinCreated_card } from "@/src/components/user/CoinCreated_card";
import { LeftCard, RightCard } from "@/src/components/user/Cards";
import { useParams } from "next/navigation";
import { useAccount } from "wagmi";
import { API_URL } from "@/src/Config";
import axios from "axios";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Profile } from "@/src/components/modals/Profile";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { ContractContext } from "@/src/Context/ContractContext";
const page = () => {
  const [coinCreated, setCoin] = useState(false);
  const {openConnectModal} = useConnectModal()
  const [followingTab, setFollowingTab] = useState(false);
  const [user, setUser] = useState({});
  const { getFollowings: getFollowingsCoins, userLikes } =
    useContext(ContractContext);
  const [loginUser, setLoginUser] = useState({});
  const [followers, setFollowers] = useState([]);
  const [followUser, setFollowUser] = useState([]);
  const [followings, setFollowings] = useState([]);

  const { address, isConnected } = useAccount();
  const { user: id } = useParams();
  const [openModal, setModal] = useState(false);
  const closeModal = () => {
    setModal(false);
  };
  const getUser = async () => {
    try {
      const config = {
        headers: {
          "x-access-token": localStorage.getItem("access_token"),
        },
      };
      const res = await axios.get(`${API_URL}/get/single/user/${id}`, config);
      if (res.status === 200) {
        setUser(res.data.user);
        // localStorage.setItem("username", res.data.user.username);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (id) {
      getUser();
    }
  }, [id]);
  useEffect(() => {
    if (id) {
      getFollowers();
      getFollowings();
    }
  }, [id]);
  const getFollowers = async () => {
    try {
      const config = {
        headers: {
          "x-access-token": localStorage.getItem("access_token"),
        },
      };
      const res = await axios.get(`${API_URL}/get/followers/${id}`, config);
      if (res.status === 200) {
        setFollowers(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getFollowings = async () => {
    try {
      //   const config = {
      //     headers: {
      //       "x-access-token": localStorage.getItem("access_token"),
      //     },
      //   };
      const res = await axios.get(`${API_URL}/get/following/${id}`);
      if (res.status === 200) {
        setFollowings(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getFollowByUserIdAndFollowerId = async () => {
    try {
      //   const config = {
      //     headers: {
      //       "x-access-token": localStorage.getItem("access_token"),
      //     },
      //   };
      const res = await axios.get(
        `${API_URL}/get/follow/${id}/${loginUser?._id}`
      );
      if (res.status === 200) {
        setFollowUser(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (loginUser?._id && id) {
      getFollowByUserIdAndFollowerId();
    }
  }, [id, loginUser?._id]);

  const getLoginUser = async () => {
    try {
      const config = {
        headers: {
          "x-access-token": localStorage.getItem("access_token"),
        },
      };
      const res = await axios.get(`${API_URL}/get/user`, config);
      if (res.status === 200) {
        setLoginUser(res.data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (address) {
      getLoginUser();
    }
  }, [address]);

  const [loading, setLoading] = useState(false);
  const createFollow = async () => {
    setLoading(true);
    try {
      //   const config = {
      //     headers: {
      //       "x-access-token": localStorage.getItem("access_token"),
      //     },
      //   };
      const res = await axios.post(`${API_URL}/follow`, {
        userId: user?._id,
        followerId: loginUser?._id,
      });
      if (res.status === 201) {
        setLoading(false);
        getFollowers();
        getFollowingsCoins();
        getFollowByUserIdAndFollowerId();
        getFollowersByUserId();
        // getLikesByCommentId();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const unfollowUser = async () => {
    setLoading(true);
    try {
      //   const config = {
      //     headers: {
      //       "x-access-token": localStorage.getItem("access_token"),
      //     },
      //   };
      const res = await axios.post(`${API_URL}/unfollow`, {
        userId: user?._id,
        followerId: loginUser?._id,
      });
      if (res.status === 200) {
        setLoading(false);
        getFollowers();
        getFollowingsCoins();
        getFollowByUserIdAndFollowerId();
        getFollowersByUserId();
        // getLikesByCommentId();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const [tokenData, setTokenData] = useState([]);
  const [tokenHeld, setTokenHeld] = useState([]);
  const filteredTokens = tokenData?.filter((e) => e.published === true);

  const getCreatedToken = async () => {
    await axios({
      method: "GET",
      url: `${API_URL}/token/${user?._id}`,
      headers: {
        "Accept-Encoding": "application/json",
        // 'Origin' : process.env.ORIGIN
      },
    })
      .then((_data) => {
        console.log(_data);

        setTokenData(_data.data.data);
      })
      .catch((err) => {
        //  throw err
        console.log(err);
      });
  };
  useEffect(() => {
    if (user?._id) {
      getCreatedToken();
    }
  }, [user?._id]);
  const getHeldToken = async () => {
    try {
      //   const config = {
      //     headers: {
      //       "x-access-token": localStorage.getItem("access_token"),
      //     },
      //   };
      const res = await axios.get(`${API_URL}/get/token/held/${user?._id}`);
      if (res.status === 200) {
        setTokenHeld(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (user) {
      getHeldToken();
    }
  }, [user]);

  const refresh = () => {
    setTokenHeld([]);
    getHeldToken();
  };

  return (
    <>
      <section
        className={
          style.user +
          " d-flex flex-column flex-lg-row align-items-center justify-content-between container mt-5"
        }
      >
        <div className="d-flex align-items-center gap-2">
          {/* <img src="/assets/inside_user.svg" alt="" /> */}
          {user?.image ? (
            <Typography
              component={"img"}
              src={user?.image}
              sx={{
                my: "0.5rem",
                borderRadius: "12px",
                width: "54px",
                height: "54px",
                border: "1px solid rgb(255 255 255 / 50%)",
              }}
            />
          ) : (
            <AccountCircleIcon
              sx={{
                fontSize: "4.5rem",
                color: "#ccbcbc",
              }}
            />
          )}
          <div>
            <h1>@{user?.username}</h1>
            {/* <select name="" id="">
                            <option value="">0xc0ffee254729296acbd...4979</option>
                        </select> */}
            <p className="mb-0">
              {" "}
              {user?.address
                ? `${user?.address.slice(0, 8)}...${user?.address.slice(-4)}`
                : ""}
            </p>
          </div>
        </div>
        <div
          className={
            style.right +
            " d-flex mt-0 justify-content-between gap-lg-5 gap-3 align-items-center"
          }
        >
          {isConnected && (
            <div className="d-flex gapx-lg-5 gap-3">
              <div>
                <span>Followers</span>
                <p className="mb-0">
                  {followers?.length > 0
                    ? followers?.length?.toString().padStart(2, "0")
                    : 0}
                </p>
              </div>
              <div>
                <span>Followings</span>
                <p className="mb-0">
                  {followings?.length > 0
                    ? followings?.length?.toString().padStart(2, "0")
                    : 0}
                </p>
              </div>
              <div>
                <span>Likes</span>
                <p className="mb-0">
                  {userLikes > 0 ? userLikes?.toString().padStart(2, "0") : 0}
                </p>
              </div>

              {/* <div>
              <span>Mentions</span>
              <p>0</p>
            </div> */}
            </div>
          )}

          {isConnected ? (
            user?._id == loginUser?._id ? (
              <button
                className="btn1 py-2 px-sm-5 px-3"
                onClick={() => setModal("profile")}
              >
                Edit Profile
              </button>
            ) : (
              <button
                className="btn1 py-2 px-sm-5 px-3"
                onClick={followUser?.length > 0 ? unfollowUser : createFollow}
              >
                {loading ? (
                  <Box>
                    <CircularProgress
                      sx={{
                        width: "15px !important",
                        height: "15px !important",
                        color: "#fff !important",
                        m: "0",
                      }}
                    />
                  </Box>
                ) : followUser?.length > 0 ? (
                  "Unfollow"
                ) : (
                  "Follow"
                )}
              </button>
            )
          ) : (
            // <ConnectButton />
            <button className="btn1 py-2 px-4" onClick={openConnectModal}>Connect Wallet</button>
          )}
        </div>
      </section>
      <section
        className={
          style.row2 +
          " d-flex flex-column flex-lg-row gap-lg-5 gap-4 container my-4"
        }
      >
        <div className={style.left + " p-3 flex-grow-1"}>
          <div className="d-flex gap-sm-3 gap-2 mb-3">
            <button
              className={!coinCreated ? "activetab" : ""}
              onClick={() => setCoin(false)}
            >
              Coins held
            </button>
            <button
              className={coinCreated ? "activetab" : ""}
              onClick={() => setCoin(true)}
            >
              Coins Created
            </button>
            {!coinCreated && (
              <button className="activetab" onClick={refresh}>
                Refresh
              </button>
            )}
          </div>
          {!coinCreated ? (
            <div>
              {tokenHeld?.length === 0 ? (
                <Typography
                  sx={{
                    // fontFamily: "latoBold",
                    fontSize: "20px",
                    textAlign: "center",
                    p: "1rem",
                    width: "100%",
                    // border: "1px dashed #7E2EA4",
                    borderRadius: "5px",
                  }}
                >
                  Tokens not found.
                </Typography>
              ) : (
                tokenHeld?.map((e, i) => <LeftCard data={e} />)
              )}
            </div>
          ) : (
            <div>
              {filteredTokens?.length > 0 ? (
                filteredTokens?.map((e, i) => <CoinCreated_card data={e} />)
              ) : (
                <Typography
                  sx={{
                    // fontFamily: "latoBold",
                    fontSize: "20px",
                    textAlign: "center",
                    p: "1rem",
                    width: "100%",
                    // border: "1px dashed #7E2EA4",
                    borderRadius: "5px",
                  }}
                >
                  Tokens not found.
                </Typography>
              )}
            </div>
          )}
        </div>
        <div className={style.right + " p-3 flex-grow-1"}>
          <div className="d-flex gap-3 mb-3">
            <button
              className={!followingTab ? "activetab" : ""}
              onClick={() => setFollowingTab(false)}
            >
              Followers
            </button>
            <button
              className={followingTab ? "activetab" : ""}
              onClick={() => setFollowingTab(true)}
            >
              Following
            </button>
          </div>
          {!followingTab ? (
            <div>
              {followers == undefined || followers?.length === 0 ? (
                <Typography
                  sx={{
                    // fontFamily: "latoBold",
                    fontSize: "20px",
                    textAlign: "center",
                    p: "1rem",
                    width: "100%",
                    // border: "1px dashed #7E2EA4",
                    borderRadius: "5px",
                  }}
                >
                  Followers not found.
                </Typography>
              ) : (
                followers?.map((e, i) => (
                  <RightCard key={i} data={e}  />
                ))
              )}
            </div>
          ) : (
            <div>
              {followings == undefined || followings?.length === 0 ? (
                <Typography
                  sx={{
                    // fontFamily: "latoBold",
                    // fontFamily: "latoBold",
                    fontSize: "20px",
                    textAlign: "center",
                    p: "1rem",
                    width: "100%",
                    // border: "1px dashed #7E2EA4",
                    borderRadius: "5px",
                  }}
                >
                  Followings not found.
                </Typography>
              ) : (
                followings?.map((e, i) => (
                  <RightCard key={i} data={e} user={e?.userDetails} />
                ))
              )}
            </div>
          )}
        </div>
      </section>
      {openModal == "profile" ? <Profile close={closeModal} /> : null}
    </>
  );
};

export default page;
