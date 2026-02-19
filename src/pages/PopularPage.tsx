import BarsList from "../components/BarsList";
import ChatWidget from "../components/ChatWidget";
import { Footer } from "../components/Footer";
import Menu from "../components/Menu";

export function Popular() {
  return (
    <>
      <div className="page-layout">
        <Menu />
        <h1>Popular</h1>
        <BarsList />
        <ChatWidget />
        <Footer></Footer>
      </div>
    </>
  );
}
