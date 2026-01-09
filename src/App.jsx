import React, { useState } from "react";
import "./App.css";

import { HashRouter as Router, Routes, Route } from "react-router";
import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer/Footer";
import HomePage from "./components/pages/HomePage/HomePage";
import MainPage from "./components/pages/MainPage/MainPage";

const App = () => {
  return (
    <Router>
      <div>
        <Header />

        <div className="app-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/main" element={<MainPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};
export default App;
