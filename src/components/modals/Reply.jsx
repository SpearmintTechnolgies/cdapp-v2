"use client";
import { useParams } from "next/navigation";
import style from "../../style/modal.module.css";
import { useCallback, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { API_URL } from "@/src/Config";
import { Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";

const Reply = ({ close, getReplyComments, commentId }) => {
  const { id: projectId } = useParams();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imageErr, setImageErr] = useState("");
  const [responseErr, setResponseErr] = useState("");
  const handleImage = (file) => {
    setImageErr("");
    setImage(file);
  };
  const getInitialValues = () => {
    return {
      comment: "",
    };
  };
  const validationSchema = Yup.object({
    comment: Yup.string()
      .trim("Comment should not contain spaces")
      .required("Required"),
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
      replyComment();
    },
  });
    // Setup for react-dropzone
    const onDrop = useCallback((acceptedFiles) => {
      handleImage(acceptedFiles[0]); // Only take the first file
    }, []);
  
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: "image/*", // Accept only images
      maxFiles: 1,
    });
  

  const replyComment = async () => {
    setLoading(true);
    try {
      // const config = {
      //   headers: {
      //     "x-access-token": localStorage.getItem("access_token"),
      //   },
      // };
      // const res = await axios.post(
      //   `${API_URL}/create/comment`,
      //   {
      //     projectId: projectId,
      //     comment: formik.values.comment,
      //     replyTo: commentId,
      //   },
      //   config
      // );
      const formData = new FormData();
      formData.append("projectId", projectId);
      formData.append("comment", formik.values.comment);
      formData.append("replyTo", commentId);
      if (image) formData.append("image", image);

      const res = await axios.post(`${API_URL}/create/comment`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-access-token": localStorage.getItem("access_token"),
        },
      });
      if (res.status === 201) {
        setLoading(false);
        getReplyComments();
        close();
        // getComments(projectId)
        formik.resetForm();
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <>
      <div
        className={
          style.reply + " d-flex align-items-center justify-content-center"
        }
      >
        <div className={style.reply_container}>
          <form onSubmit={formik.handleSubmit}>
            <div className="d-flex flex-column gap-2 my-2">
              <label htmlFor="">Add a comment</label>
              <textarea
                id="comment"
                name="comment"
                value={formik.values.comment}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              ></textarea>
            </div>
            {formik.touched.comment && formik.errors.comment && (
              <Typography
                variant="body1"
                sx={{
                  color: "red",
                  fontSize: "14px",
                  textAlign: "start",
                }}
              >
                {formik.errors.comment}
              </Typography>
            )}
            <div className='d-flex flex-column gap-2 my-2'>
                            <p className='mb-0'>image option</p>
                            <div className={style.fileinput}>
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
            <div className="reply_btns d-flex gap-5 justify-content-between align-items-center gap-2 mt-3">
              <button className="btn2 py-2 w-50" onClick={close} type="button">
                Cancel
              </button>
              <button className="btn1 py-2 w-50" type="submit">
              {loading ? "Submitting..." : "Reply"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Reply;
