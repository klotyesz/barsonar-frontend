import { Route, Routes } from "react-router";
import { Home } from "./pages/HomePage";
import { About } from "./pages/AboutPage";
import { Bars } from "./pages/BarsPage";
import { Popular } from "./pages/PopularPage";
import { Friends } from "./pages/FriendsPage";
import { News } from "./pages/NewsPage";
import { BarDetailsPage } from "./pages/BarDetailsPage";

function App() {
  return (
    <>
      <div className="app-layout">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/bars" element={<Bars />} />
          <Route path="/popular" element={<Popular />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/news" element={<News />} />
          <Route path="/bar/:barId" element={<BarDetailsPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
