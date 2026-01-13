// App.jsx

import React, { useEffect } from "react";
import "./App.css";

import { HashRouter as Router, Routes, Route } from "react-router";
import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer/Footer";
import HomePage from "./components/pages/HomePage/HomePage";
import MainPage from "./components/pages/MainPage/MainPage";
import PrivateRoute from "./components/routing/PrivateRoute/PrivateRoute";
import SimpleSnackbar from "./components/common/SimpleSnackbar/SimpleSnackbar";

import { useDispatch, useSelector } from "react-redux";
import { selectAuthChecked } from "./redux/features/auth/authSelectors";
import { initAuthAsync } from "./redux/features/auth/authThunks";

import {
  selectSnackbarMessage,
  selectSnackbarOpen,
} from "./redux/features/snackbar/snackbarSelector";
import { hideSnackbar } from "./redux/features/snackbar/snackbarSlice";

const App = () => {
  const dispatch = useDispatch();
  const authChecked = useSelector(selectAuthChecked);

  const snackbarOpen = useSelector(selectSnackbarOpen);
  const snackbarMessage = useSelector(selectSnackbarMessage);

  useEffect(() => {
    const unsubscribe = dispatch(initAuthAsync());

    return () => unsubscribe && unsubscribe();
  }, []);

  if (!authChecked) {
    return <p>ローディング中</p>;
  }

  return (
    <Router>
      <div className="App">
        <Header />

        <div className="app-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/main"
              element={
                <PrivateRoute>
                  <MainPage />
                </PrivateRoute>
              }
            />
          </Routes>

          <SimpleSnackbar
            isOpen={snackbarOpen}
            onClose={() => dispatch(hideSnackbar())}
            message={snackbarMessage}
          />
        </div>
        <Footer />
      </div>
    </Router>
  );
};
export default App;
