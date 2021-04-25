import React, { useState, useEffect } from "react";
const ServerUrl = "http://localhost:3004/graphql";
const SpecificProduct = (props) => {
  const [SingleProduct, setSingleProduct] = useState(null);

  useEffect(() => {
    GetSpecificProducts();
  }, []);
  let { id } = props.match.params;

  const GetSpecificProducts = async () => {
    const requestbody = {
      query: `
              
      query{
          GetProductbyID( 
              id:"${id}"
              ){
                  id
                   Title
                    OnStore 
                     Owner{
                         username
                        } 
                      Price  
                       Images
                        Description
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
      const resultProduct = await FetchedProducts.json();
      setSingleProduct(resultProduct.data.GetProductbyID);
      console.log(resultProduct.data.GetProductbyID);
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <div>
      <h1>this {id}</h1>
      {SingleProduct !== null && (
        <div>
          <p>{SingleProduct.Title}</p>
          <p>{SingleProduct.Onstore}</p>
          <p>{SingleProduct.Price}</p>
          <p>{SingleProduct.Description}</p>
          <p>{SingleProduct.Owner.username}</p>
          <img
            src={`http://localhost:3004/${SingleProduct.Images}`}
            alt="hello"
            width="100px"
            height="100px"
          />
        </div>
      )}
    </div>
  );
};
export default SpecificProduct;
