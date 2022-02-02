import React from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes} from "react-router-dom";

//import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/styles/tailwind.css";

// views without layouts
import Index from "./views/Index.js";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      {/* add routes without layouts */}
      <Route path="/" exact element={<Index/>} />
      {/* add redirect for first page */}
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);