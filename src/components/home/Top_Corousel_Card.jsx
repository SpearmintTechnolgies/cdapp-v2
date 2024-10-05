import style from '@/src/app/page.module.css'
import { API_URL } from '@/src/Config';
import { Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { formatEther } from 'viem'


export const Top_Corousel_Card = ({ data }) => {
  const [tokenData, setTokenData] = useState({});
  const getTokenDetail = async () => {
    await axios({
      method: "GET",
      url: `${API_URL}/token-coin/${data?.project}`,
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
  useEffect(() => {
    getTokenDetail()
  }, [data?.project])

  return (
    <div className='w-100 px-2'>
      <div key={data?._id} className={style.tc_card + " d-flex align-items-center gap-2 w-100"}>
        <div className={`${style.left} d-flex align-items-center gap-2`}>
          <p>{`${data?.user?.slice(0, 6)}...${data?.user?.slice(
            -4
          )}`}</p>
          <p className={style.sold}>Sold</p>
          <p className='text-nowrap'>{parseFloat(formatEther(data?.amount?.toString())).toFixed(3)} Core of</p>
        </div>
        <div className={`${style.right} d-flex align-items-center gap-2`}>
          <Typography
            component={"img"}
            src={tokenData?.image}
            alt=""
          // borderRadius="12px"
          // width={"40px"}
          // height={"40px"}
          />
          <p className='text-nowrap'>{tokenData?.name?.length > 8 ? `${tokenData?.name?.slice(0, 6)}...${tokenData?.name?.slice(
            -4
          )}` : tokenData?.name}</p>
        </div>
      </div>
    </div>
  )
}
