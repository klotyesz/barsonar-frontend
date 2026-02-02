import ChatWidget from "../components/ChatWidget";
import { Footer } from "../components/Footer";
import Menu from "../components/Menu";

export function About() {
  return (
    <>
      <Menu />
      <h1>About</h1>
      <ChatWidget />
      <Footer></Footer>
    </>
  );
}
