import "./App.css";
import Home from "./Home";
import DragDrop from "./sections/DragDrop/DragDrop";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Hairstyler from "./sections/Hairstyle/Hairstyler";
import FaceShape from "./sections/FaceShape/FaceShape";
import FrameStyle from "./sections/FrameStyle/FrameStyle";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product-page" element={<DragDrop />} />
        <Route path="/face-shape" element={<FaceShape />} />
        <Route path="/frame-style" element={<FrameStyle />} />
        <Route path="/hairstyle-page" element={<Hairstyler/>}/>
        <Route path="/face-shape-page" element={<FaceShape/>}/>        
      </Routes>
    </Router>
  );
}

export default App;
