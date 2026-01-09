// components/page/MainPage/MainPage.jsx

import React from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";

import Button from "../../common/Button/Button";

import { signOutUserAsync } from "../../../redux/features/auth/authThunks";

const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignOut = () => {
    try {
      dispatch(signOutUserAsync()).unwrap();

      alert("ログアウト成功");
      navigate("/");
    } catch (error) {
      alert(error, "ログアウト失敗");
    }
  };
  return (
    <div>
      <p>MainPage</p>
      <Button onClickHandler={handleSignOut}>ログアウト</Button>
    </div>
  );
};

export default MainPage;
