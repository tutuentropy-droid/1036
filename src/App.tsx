import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import ScriptKiller from "@/pages/ScriptKiller";
import HotReviewWall from "@/pages/HotReviewWall";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/script-killer" element={<ScriptKiller />} />
        <Route path="/hot-reviews" element={<HotReviewWall />} />
      </Routes>
    </Router>
  );
}
