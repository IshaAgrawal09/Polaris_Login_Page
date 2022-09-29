import React from "react";
import { Routes, Route } from "react-router-dom";
import "@shopify/polaris/build/esm/styles.css";
import "./App.css";
import Home from "./Components/Home";
import Login from "./Components/Login";

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login  />} />
        <Route
          path="/home"
          element={<Home  />}
        />
      </Routes>
    </div>
  );
}

export default App;
