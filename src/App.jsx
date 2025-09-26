import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import OS from "./pages/OS";
import DS from "./pages/DS";
import Java from "./pages/Java";

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <div className="logo"><Link to="/">My Notes (Practicals)</Link></div>
      </header>
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/os" element={<OS />} />
          <Route path="/ds" element={<DS />} />
          <Route path="/java" element={<Java />} />
        </Routes>
      </main>
    </div>
  );
}
