import { Route, Routes } from "react-router";
import { Home } from "./pages/HomePage";
import { About } from "./pages/AboutPage";
import { Bars } from "./pages/BarsPage";
import { Popular } from "./pages/PopularPage";
import { Friends } from "./pages/FriendsPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/bars" element={<Bars />} />
        <Route path="/popular" element={<Popular />} />
        <Route path="/friends" element={<Friends />} />
      </Routes>
    </>
  );
}

export default App;
