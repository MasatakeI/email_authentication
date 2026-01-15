// src/components/page/MainPage/MainPage.jsx

import React from "react";
import "./MainPage.css";

import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";

import Button from "../../common/Button/Button";

import { signOutUserAsync } from "@/redux/features/auth/authThunks";

const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      await dispatch(signOutUserAsync()).unwrap();

      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="main-page">
      <p>ログイン成功</p>
      <div className="logout-button">
        <Button onClickHandler={handleSignOut}>ログアウト</Button>
      </div>
    </div>
  );
};

export default MainPage;
