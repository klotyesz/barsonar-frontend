import ChatWidget from "../components/ChatWidget";
import { Footer } from "../components/Footer";
import Menu from "../components/Menu";

export function Home() {
  return (
    <>
      <Menu />
      <h1>Home</h1>
      <ChatWidget />
      <Footer></Footer>
    </>
  );
}
