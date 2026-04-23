import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router";
import { Home } from "./pages/HomePage";
import { About } from "./pages/AboutPage";
import { Bars } from "./pages/BarsPage";
import { RecommendationPage } from "./pages/RecommendationPage";
import { Friends } from "./pages/FriendsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { BarDetailsPage } from "./pages/BarDetailsPage";
import { HelpPage } from "./pages/HelpPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <>
      <div className="app-layout">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/bars" element={<Bars />} />
          <Route path="/recommendations" element={<RecommendationPage />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/bar/:barId" element={<BarDetailsPage />} />
          <Route path="/help" element={<HelpPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
