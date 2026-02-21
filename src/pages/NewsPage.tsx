import ChatWidget from "../components/ChatWidget";
import { Footer } from "../components/Footer";
import Menu from "../components/Menu";

export function News() {
  return (
    <>
      <div className="page-layout">
        <Menu />
        <h1>News</h1>
        <ChatWidget />
        <Footer></Footer>
      </div>
    </>
  );
}