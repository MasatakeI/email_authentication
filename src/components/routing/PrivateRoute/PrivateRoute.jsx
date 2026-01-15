// src/components/routing/PrivateRoute/PrivateRoute.jsx

import { Navigate } from "react-router";
import { useSelector } from "react-redux";
import {
  selectUser,
  selectAuthChecked,
} from "../../../redux/features/auth/authSelectors";

const PrivateRoute = ({ children }) => {
  const user = useSelector(selectUser);
  const authChecked = useSelector(selectAuthChecked);

  if (!authChecked) {
    return <p>認証確認中...</p>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!user.emailVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
