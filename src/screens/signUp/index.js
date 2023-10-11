// SignUp/index.js
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addNewUser, loginWith3rdParty } from "./api";
import { validateForm } from "./validator/utils";
import Design from "./design";

function SignUp() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
    email: "",
    password: "",
    errors: {},
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const errors = validateForm(userData);

    if (Object.keys(errors).length === 0) {
      const payload = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        password: userData.password,
        phone_no: userData.phoneNo,
      };
      addNewUser(payload)
        .then((response) => {
          if (response.data.success) {
            console.log(response);
          } else {
            toast.success(response.data.message, {
              position: "bottom-left",
              autoClose: 2500,
              hideProgressBar: true,
              closeOnClick: false,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
              theme: "light",
              type: response.data.success ? "success" : "error",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      setUserData({ ...userData, errors: {} });
    } else {
      setUserData({ ...userData, errors });
    }
  };

  const handleGoogle = (decoded) => {
    const { given_name, family_name, email, sub } = decoded;
    const payload = {
      first_name: given_name,
      last_name: family_name ? family_name : " ",
      email: email,
      third_party_user_id: sub,
      third_party_type: "Google",
    };
    loginWith3rdParty(payload)
      .then((response) => {
        if (response.data.success) {
          window.location.href = "/";
        } else {
          toast.success(response.data.message, {
            position: "bottom-left",
            autoClose: 2500,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "light",
            type: response.data.success ? "success" : "error",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <Design
        userData={userData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleGoogle={handleGoogle}
      />
      <ToastContainer />
    </div>
  );
}

export default SignUp;