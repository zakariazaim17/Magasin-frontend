import React, { useState, useEffect } from "react";
import { useParams, withRouter } from "react-router-dom";
const ServerUrl = "http://localhost:3004/graphql";

const GeneralProducts = (props) => {
  const [Products, setProducts] = useState([]);

  useEffect(() => {
    GetProducts();
  }, []);
  let { id } = props.match.params;

  const GetProducts = async () => {
    const requestbody = {
      query: `
            query{
              GetAllproducts{
                id
                Title
                  Price
                }
              }`,
    };
    try {
      const FetchedProducts = await fetch(ServerUrl, {
        method: "POST",
        body: JSON.stringify(requestbody),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ClientToken")}`,
          "Content-Type": "application/json",
        },
      });
      if (FetchedProducts.status !== 200 && FetchedProducts.status !== 201) {
        throw new Error("Failed");
      }
      const resultProducts = await FetchedProducts.json();
      console.log(resultProducts.data);
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <div>
      <h1>this is tfoo {id}</h1>
    </div>
  );
};
export default GeneralProducts;
