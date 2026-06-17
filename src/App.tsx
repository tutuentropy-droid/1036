import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import ScriptKiller from "@/pages/ScriptKiller";
import HotReviewWall from "@/pages/HotReviewWall";
import MusicControl from "@/components/MusicControl";

export default function App() {
  return (
    <Router>
      <MusicControl />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/script-killer" element={<ScriptKiller />} />
        <Route path="/hot-reviews" element={<HotReviewWall />} />
      </Routes>
    </Router>
  );
}
