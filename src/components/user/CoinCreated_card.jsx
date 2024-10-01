import { Typography } from "@mui/material";
import style from "../../style/user.module.css";
import Link from "next/link";
import { formatEther } from "viem";
import { useReadContract } from "wagmi";
import TOKEN_COIN_ABI from "../../Config/TOKEN_COIN_ABI.json";
import { POOL_ADDRESS } from "@/src/Config";

export const CoinCreated_card = ({ data }) => {
  const { data: getMarketCap } = useReadContract({
    abi: TOKEN_COIN_ABI,
    address: POOL_ADDRESS,
    functionName: "getMarketCap",
    args: [data?._id],
  });
  return (
    <div className={style.card} style={{marginBottom:"1rem"}}>
      <Link href="/inside/userid" className="text-decoration-none">
        <div className={style.row1 + " d-flex gap-2"}>
          <div>
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
          </div>
          <div>
            <Link href="/inside/userid" className="text-decoration-none">
              <h3>{data?.name}</h3>
            </Link>
            <p className="mb-0 opacity-75">
              Badge <strong>Crown</strong>
            </p>
          </div>
        </div>
        <div
          className={style.secondrow + " d-flex my-4 justify-content-between"}
        >
          <div className="d-flex gap-3 gap-xl-5">
            <div>
              <span>Symbol</span>
              <p className="mb-0 text-center">{data?.symbol}</p>
            </div>
            <div>
              <span>Market cap</span>
              <p className="mb-0 text-center">
                ${data?.marketValue > 0
                  ? parseFloat(data?.marketValue).toFixed(2)
                  : 0}
              </p>
            </div>
          </div>
          <div>
            <span>Opinions</span>
            <p className="mb-0 text-center">{data?.commentData?.length}</p>
          </div>
        </div>
        <div className={style.thirdrow + " d-flex justify-content-between"}>
          <div className="d-flex gap-2">
            {/* <p className="mb-0">Created by</p> */}
            <div className="d-flex align-items-center gap-1">
              {/* <img src="/assets/demo2-hero.png" alt="" />
              <p className={style.value + " mb-0"}>
                <Link
                  href="/profile/userid"
                  className="text-decoration-none"
                  style={{ color: "var(--dark)" }}
                >
                  Devmao
                </Link>
              </p> */}
            </div>
          </div>
          <div className="d-flex gap-1 align-items-center">
            <p className="mb-0">Created On</p>
            <p className={style.value + " mb-0"}>{new Date(data?.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};
