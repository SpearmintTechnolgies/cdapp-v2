import React from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { formatEther, parseEther } from "viem";
import { POOL_ADDRESS } from "../Config";
import TOKEN_COIN_ABI from "../Config/TOKEN_COIN_ABI.json";


function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle
      sx={{
        m: 0,
        fontSize: "1.2rem",
        p: 1.2,
        color: "#000",
        borderBottom: "2px solid rgba(255, 255, 255, 0.22)",
        backdropFilter:"none"
      }}
      {...other}
    >
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 6,
            top: 6,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

const AmountModal = ({
  amountModal,
  setAmountModal,
  createCoin,
  handleOnchange,
  buyValue,
  setBuyValue,
  symbol
}) => {


  const { data: getTokensForAmount } = useReadContract({
    abi: TOKEN_COIN_ABI,
    address: POOL_ADDRESS,
    functionName: "getBuyTokens",
    args: [123456, false,(buyValue*1e18 || 0)],
  });


  const { address, isConnected } = useAccount();
  const { data: balance, queryKey: balanceQueryKey } = useBalance({
    address: address,
  });

  return (
    <>
      <Dialog
        onClose={() => setAmountModal(false)}
        disableScrollLock
        aria-labelledby="customized-dialog-title"
        open={amountModal}
        sx={{
          "& .MuiDialogContent-root": {
            padding: "1.2rem 1rem",
          },
          "& .MuiDialogActions-root": {
            padding: "1rem",
          },
          "& .MuiDialog-container": {
            backdropFilter: "blur(2px)",
          },
          "& .MuiPaper-root": {
            // maxWidth: "90% !important",
            maxWidth: "400px !important",
            background: "#e5e1dc",
            // backgroundImage:
            //   "linear-gradient(305deg, rgb(38 0 252 / 5%), rgb(255 0 234 / 9%))",
            border: "2px solid rgba(255, 255, 255, 0.22) !important",
            // backdropFilter: "blur(12.5px)",
            color: "#fff",
            width: { md: "100% !important", xs: "300px !important" },
            overflowX: { md: "auto", xs: "scroll" },
          },
        }}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={() => setAmountModal(false)}
        >
          Enter Buy Amount
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box sx={{
            "& .MuiFormControl-root": {
              width: "100%",
              border: "1px solid rgb(255 255 255 / 50%) !important",
              borderRadius: "5px ",
              background: "#fff",
              color: "#000",
              "&:focus-Visible": {
                outline: "none !important",
                border: "none !important",
              },
              "&:hover": {
                border: "none",
              },

              "&:focus": {
                boxShadow: "none !important",
                border: "2px solid #222222 !important",
                borderRadius: "0px !important ",
              },
              "& .MuiInputBase-root": {
                "&::before": {
                  display: "none",
                },
                "&::after": {
                  display: "none",
                },
              },
              "& input": {
                padding: "7px",
                fontSize: "18px",
                borderRadius: "10px",
                fontWeight: "500",
                // fontFamily: "lato !important",
                color: "#000",
                "&::placeholder": {
                  color: "#000 !important",
                  //   fontFamily: "lato",
                  fontSize: "16px",
                },
                "&[type=number]": {
                  "-moz-appearance": "textfield",
                  "&::-webkit-outer-spin-button": {
                    "-webkit-appearance": "none",
                    margin: 0,
                  },
                  "&::-webkit-inner-spin-button": {
                    "-webkit-appearance": "none",
                    margin: 0,
                  },
                },
              },

            },
            "& .error": {
              marginTop: "0.5rem !important",
              fontSize: "14px !important",
              color: "red !important",
              textAlign: "start",
            },
            "& .label": {
              marginBottom: "0.1rem",
              //   fontFamily: "latoBold",
              fontSize: "16px",
              color: "#000",
              textAlign: "start",
            },
          }}>
            <div className="d-flex justify-content-between my-2  p-2 rounded" style={{background:'var(--main-light)'}}>
              <p className="text-dark mb-0"><span className="opacity-50">Balance</span> {parseFloat(formatEther(balance?.value)).toFixed(2)}</p>
              <button className="btn1" onClick={() => setBuyValue(parseFloat(formatEther(balance?.value) - (formatEther(balance?.value)*0.02)).toFixed(2))}>Max</button>
            </div>
            <Typography className="label">Amount</Typography>
            <div className="d-flex bg-white px-2 rounded">
            <TextField
              autoComplete="off"
              id="description"
              name="description"
              type="number"
              // className={classes.bin1}
              placeholder="Enter Amount.."
              variant="standard"
              onChange={handleOnchange}
              value={buyValue}
              className="w-50 flex-grow-1"
            />
            <div className="d-flex align-items-center">
              <img src="/assets/bnb.png" width="20px" alt="" />
              <p className="text-dark mb-0 ms-1">CORE</p>
            </div>
            </div>
            <div className={"d-flex gap-2 mb-3 mt-2"}>
              <button className="btn2"  onClick={() => setBuyValue("25")}>25 CORE</button>
              <button className="btn2"  onClick={() => setBuyValue("50")}>50 CORE</button>
              <button className="btn2"  onClick={() => setBuyValue("200")}>200 CORE</button>
            </div>
          </Box>
          <Typography
              sx={{
                fontSize: "14px",
                color: "#000",
                fontWeight: "600",
                opacity: ".7",
              }}
            >

              {getTokensForAmount && buyValue != ""
                ? parseFloat(formatEther(getTokensForAmount?.[0])).toFixed(6)
                : 0}{" "}
              {/* {tokenData?.isToken === false ? "TBNB" : "USDT"} */}
              {symbol}
            </Typography>
          <Box textAlign={"center"} py={"0.5rem"}>
            <button
              className="btn1 p-2 w-50 mt-3" onClick={() => createCoin()}>
              Continue
            </button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AmountModal;
