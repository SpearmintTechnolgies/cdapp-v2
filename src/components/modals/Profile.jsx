"use client";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { API_URL } from "../../Config/index";
import axios from "axios";
import style from "../../style/modal.module.css";
import { Box, Typography } from "@mui/material";
import { useAccount } from "wagmi";
import { ContractContext } from "@/src/Context/ContractContext";
import { useDropzone } from "react-dropzone";

export const Profile = ({ close }) => {
  const { user, getUser } = useContext(ContractContext);

  const [image, setImage] = useState(null);
  const [imageErr, setImageErr] = useState("");
  const [responseErr, setResponseErr] = useState("");

  const handleImage = (file) => {
    setImageErr("");
    setImage(file);
  };

  // Setup for react-dropzone
  const onDrop = useCallback((acceptedFiles) => {
    handleImage(acceptedFiles[0]); // Only take the first file
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*", // Accept only images
    maxFiles: 1,
  });

  const getInitialValues = () => {
    return {
      bio: "",
      username: "",
    };
  };

  useEffect(() => {
    if (user != null) {
      formik.setValues({
        bio: user?.bio || "",
        username: user?.username || "",
        
      });
    }
  }, [user]);

  const validationSchema = Yup.object({
    username: Yup.string()
      .trim("Username should not contain spaces")
      .required("Required"),
  });

  const initialValues = getInitialValues();
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm, errors }) => {
      if (errors) {
        setErrors(errors);
      }
      updateUser();
    },
  });

  const [loading, setLoading] = useState(false);

  const updateUser = async () => {
    setLoading(true);
    setResponseErr(false)
    try {
      const formData = new FormData();
      formData.append("username", formik.values.username);
      formData.append("bio", formik.values.bio);
      if (image) formData.append("image", image);

      const res = await axios.put(`${API_URL}/update/user`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-access-token": localStorage.getItem("access_token"),
        },
      });

      if (res.status === 200) {
        setImage(null);
        getUser();
        setLoading(false);
      } else {
        if(res.data.error.includes("options.maxFileSize")){
          setResponseErr("Please upload image less than 512KB");
        }
        setLoading(false);
      }
    } catch (err) {
      // if (err.response?.status === 400) {
      //   setResponseErr(err.response.data.error);
      // }
      if(err.response.data.error.includes("options.maxFileSize")){
        setResponseErr("Please upload image less than 512KB");
      }
      setLoading(false);
    }
  };
  function handleOuter(e){
    var flage = [...e.target.classList].includes("outer_profile")
    if(flage){
      close()
    }
  }

  return (
    <Box
      sx={{
        "& .error": {
          fontSize: "14px !important",
          color: "red !important",
          textAlign: "start",
        },
      }}
      onClick={handleOuter}
      className={style.profile + " d-flex justify-content-center align-items-center outer_profile"}
    >
      <div>
        <form onSubmit={formik.handleSubmit}>
          <h1 className="text-center">Edit Profile</h1>
          <div>
            <div className="my-3">
              <p>User name*</p>
              <input
                type="text"
                id="username"
                name="username"
                value={formik.values.username}
                onChange={(e) => {
                  formik.handleChange(e);
                  setResponseErr("");
                }}
                onBlur={formik.handleBlur}
              />
              {formik.touched.username && formik.errors.username && (
                <Typography variant="body1" className="error">
                  {formik.errors.username}
                </Typography>
              )}
            </div>

            <div>
              <p>Profile Picture</p>
              <Box textAlign={"center"}>
                {user?.image ? (
                  <Typography
                    component={"img"}
                    src={user?.image}
                    sx={{
                      my: "0.5rem",
                      borderRadius: "50%",
                      width: { sm: "80px", xs: "80px" },
                      height: { sm: "80px", xs: "80px" },
                      border: "1px solid rgb(255 255 255 / 50%)",
                    }}
                  />
                ) : (
                  <AccountCircleIcon sx={{ fontSize: { sm: "6rem", xs: "6rem" } }} />
                )}
              </Box>

              <div className={style.fileinput}>
                <div
                  {...getRootProps({
                    className: "p-3 d-flex align-items-center justify-content-around",
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

            <div className="my-3">
              <p>Bio</p>
              <textarea
                name="bio"
                id="bio"
                value={formik.values.bio}
                onChange={(e) => {
                  formik.handleChange(e);
                  setResponseErr("");
                }}
                onBlur={formik.handleBlur}
              />
              {formik.touched.bio && formik.errors.bio && (
                <Typography variant="body1" className="error">
                  {formik.errors.bio}
                </Typography>
              )}
              {responseErr && (
                <Typography variant="body1" className="error">
                  {responseErr}
                </Typography>
              )}
            </div>

            <div className="d-flex gap-5 mt-4">
              <button className="btn2 py-2 w-50" type="button" onClick={close}>
                Cancel
              </button>
              <button className="btn1 w-50 py-2" type="submit">
                {loading ? "Loading..." : "Update profile"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Box>
  );
};
