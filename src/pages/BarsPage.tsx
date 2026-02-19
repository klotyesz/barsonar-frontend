import ChatWidget from "../components/ChatWidget";
import { Footer } from "../components/Footer";
import Menu from "../components/Menu";

export function Bars() {
  return (
    <>
      <div className="page-layout">
        <Menu />
        <h1>Bars</h1>
        <ChatWidget />
        <Footer></Footer>
      </div>
    </>
  );
}
