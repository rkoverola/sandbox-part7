import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import store from "./store";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { Container } from "@mui/material";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Container>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </Container>
);
