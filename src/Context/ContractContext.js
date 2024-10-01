import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { API_URL } from "../Config";
import { useAccount } from "wagmi";


export const ContractContext = createContext();
const ContractContextProvider = ({ children }) => {
  const [show, setShow] = useState(true);
  const [coinData, setCoinData] = useState([]);
  const [accessToken, setaccessToken] = useState(null);
  const [listedCoins, setListedCoinData] = useState([]);
  const [forYouCoins, setForYouCoins] = useState([]);
  
  const [commentData, setCommentData] = useState([]);
  const [crownData, setCrownData] = useState({});
  const [selectedChain, setSelectedChain] = useState(0);
  const [user, setUser] = useState({});
  const [followings, setFollowings] = useState([]);
  const [userLikes, setUserLikes] = useState([]);
  const { address } = useAccount();
  const getFollowings = async () => {
    try {
        const config = {
          headers: {
            "x-access-token": localStorage.getItem("access_token"),
          },
        };
      const res = await axios.get(`${API_URL}/get/following/by/userId`,config);
      if (res.status === 200) {
        setFollowings(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getUserLikes = async () => {
    try {
        const config = {
          headers: {
            "x-access-token": localStorage.getItem("access_token"),
          },
        };
      const res = await axios.get(`${API_URL}/likes/by/userId`,config);
      if (res.status === 200) {
        setUserLikes(res.data.likesCount);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getListedCoin = async () => {
    await axios({
      method: "GET",
      url: `${API_URL}/listed/token-coins`
    })
      .then((_data) => {
        if(_data.data.coinsData){
          setListedCoinData(_data.data.coinsData.reverse());
        }
      })
      .catch((err) => {
        //  throw err
        console.log(err);
      });
  };

  const getForYouCoin = async () => {

    const token = localStorage.getItem("access_token")

    await axios({
      method: "GET",
      url: `${API_URL}/get/token/for/you?token=${token}`
    })
      .then((_data) => {
        setForYouCoins(_data.data.data.reverse());
      })
      .catch((err) => {
        //  throw err
        console.log(err);
      });
  };

  const getCoin = async () => {
    await axios({
      method: "GET",
      url: `${API_URL}/token-coins`
    })
      .then((_data) => {
        if(_data.data.coinsData){
          setCoinData(_data.data.coinsData.reverse());
        }
      })
      .catch((err) => {
        //  throw err
        console.log(err);
      });
  };
  const getComments = async (projectId) => {
    await axios({
      method: "GET",
      url: `${API_URL}/get/comments/${projectId}`,
    })
      .then((_data) => {
        setCommentData([]);
        if(_data.data.data){
          const reversedArray = _data.data.data.reverse();
          setCommentData(reversedArray);
          getCoin()
          getUserLikes()
        }
    
      })
      .catch((err) => {
        //  throw err
        console.log(err);
      });
  };
  const getCrown = async () => {
    await axios({
      method: "GET",
      url: `${API_URL}/get/crown`,
      // headers: {
      //   "Accept-Encoding": "application/json",
      //   "x-access-token": localStorage.getItem("access_token"),
      // },
    })
      .then((_data) => {
        setCrownData(_data.data);
      })
      .catch((err) => {
        //  throw err
        console.log(err);
      });
  };

  
  useEffect(() => {
    getCrown()
    getCoin();
    getListedCoin();
    getForYouCoin()
  }, []);
  const getUser = async () => {
    try {
      const config = {
        headers: {
          "x-access-token": localStorage.getItem("access_token"),
        },
      };
      const res = await axios.get(`${API_URL}/get/user`, config);
      if (res.status === 200) {

        setUser(res.data.user);
        localStorage.setItem("username", res.data.user.username);
        localStorage.setItem("uid", res.data.user._id);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUser();
    getFollowings()
    getUserLikes()
    getForYouCoin();
  }, [address]);
  return (
    <ContractContext.Provider
      value={{
        show,
        setShow,
        coinData,
        getCoin,
        getComments,
        commentData,
        crownData,
        getCrown,
        selectedChain,
        setSelectedChain,
        getUser,
        user,
        getForYouCoin,
        forYouCoins,
        listedCoins,        
        followings,
        getFollowings,
        getUserLikes,
        userLikes
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};
export default ContractContextProvider;
