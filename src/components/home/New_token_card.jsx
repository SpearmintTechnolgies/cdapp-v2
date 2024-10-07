import style from "@/src/app/page.module.css"
import { API_URL } from "@/src/Config";
import axios from "axios";
import Link from "next/link"
import { useEffect, useState } from "react";

export const New_token_card = ({data}) => {
  
  const [user, setUser] = useState([]);
  const getUser = async () => {
    await axios({
      method: "GET",
      url: `${API_URL}/get/single/user/${data?.createdBy}`,
    })
      .then((_data) => {
        setUser(_data.data.user)
        console.log("username", _data.data.user)

      })
      .catch((err) => {
        //  throw err
        console.log(err);
      });
  };

  useEffect(() => {
    getUser()
  }, [data?.createdBy])


  return (
    <div className={style.nt_card+" d-flex justify-content-between align-items-center"}>
        <div className="d-flex gap-2 align-items-center">
            <img style={{"borderRadius" : "20px"}} width={"50px"} src={data?.image} alt="" />
            <div>
                <h3>{data?.symbol}</h3>
                <p className="mb-0">by {user?.username?.length > 8
                    ? `${user?.username.slice(0, 4)}...${user?.username.slice(
                      -4
                    )}`
                    : user?.username}</p>  
            </div>
        </div>
        <Link href={`/inside/${data?._id}`} className="d-flex justify-content-center align-items-center">
            <img src="/assets/icons/right-top-arrow.svg" alt="" />
        </Link>
    </div>
  )
}
