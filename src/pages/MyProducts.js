import React, { useEffect, useState } from "react";

const ServerUrl = "http://localhost:3004/graphql";
const MyProducts = () => {
  const [myProductsdata, setmyProductsdata] = useState([]);
  useEffect(() => {
    GetMyProducts();
  }, []);

  const GetMyProducts = async () => {
    const requestbody = {
      query: `

            query {
              GetProductsByClient(id: "${localStorage.getItem(
                "CurentcliEnt"
              )}") {
                id
                Title
                Price
                Images
                
                CodePromo {
                  id
                  Expiry
                  Percentage
                  Code
                }
              }
            }`,
    };

    try {
      const resultedMyProducts = await fetch(ServerUrl, {
        method: "POST",
        body: JSON.stringify(requestbody),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const finalMyProducts = await resultedMyProducts.json();
      console.log(finalMyProducts.data.GetProductsByClient);
      setmyProductsdata(finalMyProducts.data.GetProductsByClient);
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <div className="main-wrapper">
      <h1>this is MyProducts</h1>
      {myProductsdata.length !== 0 &&
        myProductsdata.map((obj) => {
          return (
            <div key={obj.id}>
              <p>{obj.Title}</p>
              <p>{obj.Price}</p>
              {obj.CodePromo !== null && (
                <>
                  <p>"zcz{obj.CodePromo.Code}"</p>
                  <p>{obj.CodePromo.Percentage}</p>
                </>
              )}
              <img
                src={`http://localhost:3004/${obj.Images}`}
                alt="hello"
                width="150px"
                height="150px"
              />
            </div>
          );
        })}
    </div>
  );
};

export default MyProducts;
