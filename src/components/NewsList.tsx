"use client";

import { useEffect, useState } from "react";
import type { News } from "../interfaces/News";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const NewsList = () => {
  const [news, setNews] = useState<News[]>([]);

  const fetchNews = async () => {
    const response = await fetch(`${API_BASE_URL}/place/allNews`);
    const data: News[] = await response.json();
    setNews(data);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <>
      <section className="container-fluid mt-3">
        <div className="row">
          {news.map((news) => (
            <div className="col-4 p-3" key={news.id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{news.placeID}</h5>
                  <p className="card-text">{news.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default NewsList;
