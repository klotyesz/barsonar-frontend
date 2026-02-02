"use client";

import { useEffect, useState } from "react";

interface Bar {
  id: number;
  googleplaceID: string;
  name: string;
  address: string;
}

const BarsList = () => {
  const [bars, setBars] = useState<Bar[]>([]);

  const fetchBars = async () => {
    const response = await fetch("http://localhost:3000/place");
    const data: Bar[] = await response.json();
    setBars(data);
  };

  useEffect(() => {
    fetchBars();
  }, []);

  return (
    <>
      <section className="container-fluid mt-3">
        <div className="row">
          {bars.map((bar) => (
            <div className="col-4 p-3" key={bar.id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{bar.name}</h5>
                  <p className="card-text">{bar.address}</p>
                  <button type="button" className="btn btn-primary">
                    Részletek
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
    // <table>
    //   <thead>
    //     <tr>
    //       <th>Név</th>
    //       <th>Cím</th>
    //     </tr>
    //   </thead>
    //   <tbody>
    //     {bars.map((bar) => (
    //       <tr key={bar.id}>
    //         <td>{bar.name}</td>
    //         <td>{bar.address}</td>
    //       </tr>
    //     ))}
    //   </tbody>
    // </table>
  );
};

export default BarsList;
