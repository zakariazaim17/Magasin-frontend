import React, { useState, useEffect } from "react";
import { NavLink, useParams, withRouter } from "react-router-dom";
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
    <div>
      <h1>this is tfoo {id}</h1>
      {Products.length !== 0 &&
        Products.map((obj) => {
          return (
            <NavLink key={obj.id} to={`/categories/${id}/${obj.id}`}>
              <p>{obj.Price}</p>
              <p>{obj.Title}</p>
              <img
                src={`http://localhost:3004/${obj.Images}`}
                alt="hello"
                width="100px"
                height="100px"
              />
            </NavLink>
          );
        })}
    </div>
  );
};
export default GeneralProducts;
