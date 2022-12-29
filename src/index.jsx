// import config file
//import { bookmark } from "./index.jsx";


import React from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes} from "react-router-dom";

// views without layouts
import IndexPage from "./views/Index.jsx";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      {/* add routes without layouts */}
      <Route path="/" exact element={ <IndexPage/> } />
      {/* add redirect for first page */}
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);