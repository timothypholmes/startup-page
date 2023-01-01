import React from "react";
import ReactDOM from 'react-dom';
import { HashRouter, Route, Routes} from "react-router-dom";

// views without layouts
import IndexPage from "./views/Index.jsx";

ReactDOM.render(
  <HashRouter>
    <Routes>
      {/* add routes without layouts */}
      <Route path="/" exact element={ <IndexPage/> } />
      {/* add redirect for first page */}
    </Routes>
  </HashRouter>,
  document.getElementById("root")
);