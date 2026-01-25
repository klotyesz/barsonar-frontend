import { Route, Routes } from "react-router";
import { Home } from "./pages/HomePage";
import { About } from "./pages/AboutPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
