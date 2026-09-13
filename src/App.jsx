import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import GalleryDetail from "./pages/GalleryDetail";

import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery/:slug" element={<GalleryDetail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
