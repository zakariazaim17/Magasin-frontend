import { createChainedFunction } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../css/Bidings.css";
const ServerUrl = "https://my-superi-app.jelastic.metropolia.fi/graphql";
//const ServerUrl = "http://localhost:3004/graphql";
const Bidings = () => {
  const [AllBidings, setAllBidings] = useState([]);

  useEffect(() => {
    GetBidings();
  }, []);

  const GetBidings = async () => {
    const requestbody = {
      query: `query {
      GetBidings {
        id
        Title
        Initialprice
        Images
        Owner {
          username
        }
      }
    }`,
    };

    try {
      const resultedBidings = await fetch(ServerUrl, {
        method: "POST",
        body: JSON.stringify(requestbody),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (resultedBidings.status !== 200 && resultedBidings.status !== 201) {
        throw new Error("Failed");
      }

      const Bidings = await resultedBidings.json();
      console.log(Bidings.data.GetBidings);
      setAllBidings(Bidings.data.GetBidings);
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <div className="main-wrapper">
      <h1>this is Bidings</h1>
      {AllBidings.length !== 0 &&
        AllBidings.map((obj) => {
          return (
            <NavLink key={obj.id} to={`/bidings/${obj.id}`}>
              <p>{obj.Title}</p>
              <p>{obj.Initialprice}</p>
              <p>{obj.Owner.username}</p>
              <img
                src={`https://my-superi-app.jelastic.metropolia.fi/${obj.Images}`}
                alt="hello"
              />
            </NavLink>
          );
        })}
    </div>
  );
};

export default Bidings;
