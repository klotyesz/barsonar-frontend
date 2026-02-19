import ChatWidget from "../components/ChatWidget";
import { Footer } from "../components/Footer";
import Menu from "../components/Menu";

export function About() {
  return (
    <>
      <div className="page-layout">
        <Menu />
        <h1>About</h1>
        <ChatWidget />
        <Footer></Footer>
      </div>
    </>
  );
}
