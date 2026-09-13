import { BrowserRouter, Routes, Route } from "react-router-dom";

import Gallery from "./pages/Gallery";
import Detail from "./pages/Detail";

import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/gallery/:slug" element={<Gallery />} />
        <Route path="/detail/:slug" element={<Detail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
