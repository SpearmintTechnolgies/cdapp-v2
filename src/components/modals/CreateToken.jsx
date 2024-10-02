"use client"
import style from "../../style/modal.module.css"
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  erc20ABI,
  useAccount,
  useBalance,
  useChainId,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import TOKEN_COIN_ABI from "../../Config/TOKEN_COIN_ABI.json"
import { API_URL, POOL_ADDRESS } from "@/src/Config";
import { useRouter } from "next/navigation";
import AmountModal from "../AmountModal";
import { Box, CircularProgress, Typography } from "@mui/material";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { formatEther, parseEther } from "viem";
import { useDropzone } from "react-dropzone";


export const CreateToken = ({ hide }) => {
  const [Show, setShow] = useState(false)
  const { openConnectModal } = useConnectModal()
  const { isConnected, address, connector } = useAccount();
  const { data: balance, queryKey: balanceQueryKey } = useBalance({
    address: address,
  });
  const chainId = useChainId();


  // const { getCoin } = useContext(ContractContext);
  const getInitialValues = () => {
    return {
      name: "",
      code: "",
      twitter: "",
      telegram: "",
      website: "",
      description: "",
      // decimal: "",
      token: false,
    };
  };
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [imageErr, setImageErr] = useState("");
  const [balErr, setBalErr] = useState("");
  const [id, setId] = useState("");
  const validationSchema = Yup.object({
    name: Yup.string()
      .trim("Name should not contain spaces")
      .required("Required"),
    code: Yup.string()
      .trim("Code should not contain spaces")
      .required("Required"),
    twitter: Yup.string()
      .trim("Link should not contain spaces")
    ,
    telegram: Yup.string()
      .trim("Link should not contain spaces")
    ,
    website: Yup.string()
      .trim("Link should not contain spaces")
    ,
    description: Yup.string()
      .trim("Link should not contain spaces")
    ,
    // decimal: Yup.number().required("Required"),
    token: Yup.string().required("Required"),
  });
  const initialValues = getInitialValues();
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (
      values,
      { setErrors, setSubmitting, resetForm, errors }
    ) => {
      if (errors) {
        setErrors(errors);
      }
      if (image == null) {
        setImageErr("Please select image");
        return
      }
      setAmountModal(true)
    },
  });

  const handleImage = (e) => {
    setImageErr("");
    setImage(e);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };
  const onDrop = useCallback((acceptedFiles) => {
    handleImage(acceptedFiles[0]); // Only take the first file
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*", // Accept only images
    maxFiles: 1,
  });
  const [loading, setLoading] = useState(false);

  const { data: coinFee } = useReadContract({
    abi: TOKEN_COIN_ABI,
    address: POOL_ADDRESS,
    functionName: "getDeploymentFee",
    args: [],
  });
  // console.log(coinFee);
  const createCoin = async () => {
    setAmountModal(false)
    setBalErr("")
    // alert(parseFloat(formatEther(balance?.value)))
    // if (parseFloat(formatEther(balance?.value)) < parseFloat(formatEther(coinFee || 0))) {
    //   setBalErr("Insufficient balance");
    //   return;
    // }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", formik.values.name);
      formData.append("desc", formik.values.description);
      formData.append("symbol", formik.values.code);
      // formData.append("decimal", "18");
      formData.append("twitterLink", formik.values.twitter);
      formData.append("websiteLink", formik.values.website);
      formData.append("telegramLink", formik.values.telegram);
      formData.append("isToken", formik.values.token);
      formData.append("image", image); // Assuming 'imageFile' is the file input value
      formData.append("chain", chainId);
      // formData.append("userId", localStorage.getItem("username")); 
      setError(false)

      const res = await axios.post(`${API_URL}/create/token-coin`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-access-token": localStorage.getItem("access_token"),
        },
      });

      if (res.status === 201) {
        setLoading(false);
        const { _id, name, symbol, decimal, isToken } = res.data.data;
        setId(_id);
        writeAsync(_id, name, symbol, isToken);
      } else {
        console.log(res.data);
        if(res.data.error.includes("options.maxFileSize")){
          setError("Please upload image less than 1MB");
        }
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      // setError(err.response.data.error)
      if(err.response?.data.error.includes("options.maxFileSize")){
        setError("Please upload image less than 1MB");
      }

      setLoading(false);
    }
  };
  const { data: alternateToken } = useReadContract({
    abi: TOKEN_COIN_ABI,
    address: POOL_ADDRESS,
    functionName: "alternateToken",
    args: [],
  });
  const { data: alternateTokenSymbol } = useReadContract({
    abi: erc20ABI,
    address: alternateToken,
    functionName: "symbol",
    args: [],
  });


  const { writeContractAsync } = useWriteContract();
  const [txn, setTxn] = useState("");
  const [isLoading, setIsloading] = useState("");
  const [error, setError] = useState(false);
  
  const [amountModal, setAmountModal] = useState(false);
  const [buyValue, setBuyValue] = useState("0");
  const handleOnchange = (e) => {
    // setBuyErr("");
    const value = e.target.value;
    if (value >= 0) {
      setBuyValue(value);
    }
  };

  const { data: getBuyFee } = useReadContract({
    abi: TOKEN_COIN_ABI,
    address: POOL_ADDRESS,
    functionName: "getBuyFee",
    args: [(buyValue*1e18 || 0), false],
  });

  const { data: getTokensForAmount } = useReadContract({
    abi: TOKEN_COIN_ABI,
    address: POOL_ADDRESS,
    functionName: "getBuyTokens",
    args: [123456, false,(buyValue*1e18 || 0)],
  });

  console.log(coinFee, buyValue);
  const writeAsync = async (_id, _name, _symbol, isToken) => {
    setError(false)
    const config = {
      address: POOL_ADDRESS,
      abi: TOKEN_COIN_ABI,
      functionName: "createPool",
      args: [_id, _name, _symbol, isToken, (buyValue*1e18 || 0),500,getTokensForAmount?.[0]],
      value: coinFee + (buyValue*1e18 || 0) + (buyValue > 0 ? getBuyFee : 0),
      // value: coinFee  
    };
    setTxn(null);
    try {
      setIsloading(true);
      const txn = await writeContractAsync?.(config);
      setTxn(txn);
    } catch (e) {
      setIsloading(false);
      // setError(e)
      console.log(e);
    }
  };
  const {
    isLoading: isLoadingWait,
    isSuccess: isSuccessWait,
    data: coinData,
  } = useWaitForTransactionReceipt({
    hash: txn,
  });

  const router = useRouter();
  useEffect(() => {
    if (isSuccessWait) {
      // getCoin();
      formik.resetForm();
      setImage(null);
      router.push(`/inside/${id}`);
    }
  }, [isSuccessWait]);
  function handleOutter(e){
    let flage = [...e.target.classList].includes("outterToken");
    if(flage){
      hide()
    }
  }
  return (
    <div className={style.token + " d-flex justify-content-center align-items-center outterToken"} onClick={handleOutter}>
      <Box className="my-4" sx={{
        "& .error": {
          // marginTop: "0.5rem !important",
          fontSize: "14px !important",
          color: "red !important",
          textAlign: "start",
        },
        "& .label": {
          marginBottom: "0.1rem",
          fontFamily: "latoBold",
          fontSize: "16px",
          color: "#fff",
          textAlign: "start",
        },
      }}>
        <h1 className="text-center mb-4">Create Token</h1>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <Typography
              className="p"
              sx={{ color: "var(--dark)", mb: "0rem !important", textAlign: "end", opacity: "0.6", fontSize: "15px" }}
            >
              Cost to deploy: {formatEther(coinFee || 0)?.toString()}{" "}
              {balance?.symbol}
            </Typography>
            <input type="text" placeholder="Name of Token" id="name"
              name="name"
              variant="standard"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur} />
            {formik.touched.name && formik.errors.name && (
              <Typography variant="body1" className="error">
                {formik.errors.name}
              </Typography>
            )}
          </div>
          <div>
            <input type="text" placeholder="Ticker" id="code"
              name="code"
              variant="standard"
              value={formik.values.code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur} />
            {formik.touched.code && formik.errors.code && (
              <Typography variant="body1" className="error">
                {formik.errors.code}
              </Typography>
            )}
          </div>
          <div>
            <textarea id="description"
              name="description"
              type="text"
              placeholder="Description.."
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}></textarea>
            {formik.touched.description && formik.errors.description && (
              <Typography variant="body1" className="error">
                {formik.errors.description}
              </Typography>
            )}
            {balErr && (
              <Typography
                sx={{
                  pt: "5px",
                  fontFamily: "lato",
                  fontSize: "15px",
                  color: "red",
                }}
              >
                {balErr}
              </Typography>
            )}
          </div>
          <div>
            <p>Image</p>
            <div className={style.fileinput}>
              {/* <div className="py-3 d-flex align-items-center justify-content-around">
                            <p>Drag & Drop your image</p>
                            <p>or</p>
                            <div className="position-relative">
                                <input   onChange={handleImage}
                type="file" />
                                <label htmlFor="">Upload</label>
                            </div>
                        </div> */}
              <div
                {...getRootProps({
                  className: "p-3 d-flex gap-2 align-items-center justify-content-around",
                })}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop your image here ...</p>
                ) : (
                  <>
                    <p>Drag & Drop your image</p>
                    <p>or</p>
                    <div className="position-relative">
                      <label htmlFor="">Upload</label>
                    </div>
                  </>
                )}
              </div>
            </div>
            <Typography pt={".2rem"}>{image?.name}</Typography>
            {imageErr && (
              <Typography variant="body1" className="error">
                {imageErr}
              </Typography>
            )}
          </div>
          <div style={{ display: Show ? "block" : "none" }} className={`${style.form_tbox}`} >
            <div className="d-flex align-items-center" >
            <div><img src="../assets/icons/x.svg" alt="" /></div>
            <input id="twitter"
              name="twitter"
              type="text"
              placeholder="Enter Your twitter link"
              variant="standard"
              value={formik.values.twitter}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur} />
            {formik.touched.twitter && formik.errors.twitter && (
              <Typography variant="body1" className="error">
                {formik.errors.twitter}
              </Typography>
            )}
          </div>
          </div>
          <div style={{ display: Show ? "block" : "none" }} className={`${style.form_tbox}`} >
          <div className="d-flex align-items-center" >
          <div><img src="../assets/icons/telegram.svg" alt="" /></div>
            <input id="telegram"
              name="telegram"
              type="text"
              // className={classes.bin1}
              placeholder="Enter Your telegram link"
              variant="standard"
              value={formik.values.telegram}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur} />
            {formik.touched.telegram && formik.errors.telegram && (
              <Typography variant="body1" className="error">
                {formik.errors.telegram}
              </Typography>
            )}
            </div>
          </div>
          <div style={{ display: Show ? "block" : "none" }} className={`${style.form_tbox}`} >
          <div className="d-flex align-items-center" >
          <div><img src="../assets/icons/website.svg" alt="" /></div>
            <input id="website"
              name="website"
              type="text"
              // className={classes.bin1}
              placeholder="Enter Your website link"
              variant="standard"
              value={formik.values.website}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur} />
            {formik.touched.website && formik.errors.website && (
              <Typography variant="body1" className="error">
                {formik.errors.website}
              </Typography>
            )}
            </div>
          </div>
          <button onClick={() => setShow(!Show)} className="w-100 border-0 bg-transparent" type="button">Show {Show ? "less" : "more"} options <i className="bi bi-chevron-down"></i></button>
          {
            error &&
            <Typography>{error}</Typography>
          }
          <div className="d-flex gap-5 mt-3">
            <button className="btn2 p-2 w-50" type="button" onClick={hide}>Cancel</button>

            {isConnected ? <button className="btn1 p-2 w-50" type="submit" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}>  {(loading || isLoading || isLoadingWait) && !isSuccessWait
              ? <>
                <CircularProgress
                  sx={{
                    width: "14px !important",
                    height: "14px !important",
                    color: "#fff !important",
                    m: "0",
                  }}
                /> Creating...
              </>
              : "Create Token"}</button> : <button className="btn1 p-2 w-50 position-relative">Connect
              <div className={style.connectbtn+" position-absolute w-100 h-100 start-0 top-0 opacity-0"}>
                <ConnectButton />
              </div>
            </button>}

          </div>
        </form>
      </Box>
      {/* <AmountModal buyValue={buyValue} setBuyValue={setBuyValue} amountModal={amountModal} setAmountModal={setAmountModal} createCoin={createCoin} symbol={formik.values.code} handleOnchange={handleOnchange} /> */}
    </div>
  )
}
{/* <ConnectButton label="Connect"/>} */ }