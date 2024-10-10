import "./App.css";
import Home from "./Home";
import DragDrop from "./sections/DragDrop/DragDrop";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Hairstyler from "./sections/Hairstyle/Hairstyler";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product-page" element={<DragDrop />} />
        <Route path="/hairstyle-page" element={<Hairstyler/>}/>
      </Routes>
    </Router>
  );
}

export default App;
