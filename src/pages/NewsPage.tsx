import ChatWidget from "../components/ChatWidget";
import { Footer } from "../components/Footer";
import Menu from "../components/Menu";
import NewsList from "../components/NewsList";

export function News() {
  return (
    <>
      <div className="page-layout">
        <Menu />
        <h1>News</h1>
        <NewsList></NewsList>
        <ChatWidget />
        <Footer></Footer>
      </div>
    </>
  );
}