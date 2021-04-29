import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
//const ServerUrl = "http://localhost:3004/graphql";
import "../css/GeneralProducts.css";
const ServerUrl = "https://my-superi-app.jelastic.metropolia.fi/graphql";

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
              GetProductsByCategory(Category:"${id}"){
                id
                Title
                  Price
                  Images
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
      setProducts(resultProducts.data.GetProductsByCategory);
      console.log(resultProducts.data.GetProductsByCategory);
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <div className="mainWraperGeneral">
      {Products.length !== 0 &&
        Products.map((obj) => {
          return (
            <NavLink
              key={obj.id}
              to={`/categories/${id}/${obj.id}`}
              className="SingleGeneralProduct"
            >
              <img
                src={`https://my-superi-app.jelastic.metropolia.fi/${obj.Images}`}
                alt="hello"
                className="GeneralProductimg"
              />
              <p>{obj.Title}</p>
              <p>€ {obj.Price}</p>
            </NavLink>
          );
        })}
    </div>
  );
};
export default GeneralProducts;
