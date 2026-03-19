import { useState } from "react";
import BarsMap from "../components/BarsMap";
import ChatWidget from "../components/ChatWidget";
import { Footer } from "../components/Footer";
import Menu from "../components/Menu";

export function Bars() {
  const [mapFullScreen, setMapFullScreen] = useState(false);

  return (
    <>
      <div className="page-layout">
        <Menu />
        <BarsMap onFullScreenChange={setMapFullScreen} />
        {!mapFullScreen && <ChatWidget />}
        <Footer />
      </div>
    </>
  );
}
