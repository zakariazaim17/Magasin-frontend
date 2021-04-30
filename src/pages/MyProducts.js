import React, { useEffect, useRef, useState } from "react";
import "../css/Myproducts.css";
const ServerUrl = "https://my-superi-app.jelastic.metropolia.fi/graphql";
//const ServerUrl = "http://localhost:3004/graphql";
const MyProducts = () => {
  const [myProductsdata, setmyProductsdata] = useState([]);
  const [titleinput, setYitleinput] = useState();
  useEffect(() => {
    GetMyProducts();
  }, []);

  const ModifiedTitle = useRef();
  const ModifiedPrice = useRef();
  const ModifiedDEscription = useRef();
  const ModifiedQuantity = useRef();

  const [modifyProduct, setmodifyProduct] = useState();

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
                OnStore
                Quantity
                Description
                
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

  const Product_Modification = async (e) => {
    setmodifyProduct(e);
    console.log(modifyProduct);

    const requestbody = {
      query: `
      
      mutation {
        UpdateProduct(id:"${modifyProduct.id}",Title:"${modifyProduct.Title}", Price:${modifyProduct.Price}, Description:"${modifyProduct.Description}", Quantity: ${modifyProduct.Quantity} ) {
          id
          Title
           
        }
      }`,
    };

    try {
      const updatedProduct = await fetch(ServerUrl, {
        method: "POST",
        body: JSON.stringify(requestbody),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const updatedfinalProduct = await updatedProduct.json();
      console.log(updatedfinalProduct);
      window.location.reload();
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <div className="parent-Modification">
      {modifyProduct && (
        <div className="Product-modification-div">
          <p>modify here {modifyProduct.id}</p>
          <div className="modifySection">
            <label>Title</label>
            <input
              value={modifyProduct.Title}
              onChange={(e) =>
                setmodifyProduct({ ...modifyProduct, Title: e.target.value })
              }
            />
          </div>
          <div className="modifySection">
            <label>Price</label>
            <input
              value={modifyProduct.Price}
              onChange={(e) =>
                setmodifyProduct({ ...modifyProduct, Price: e.target.value })
              }
            />
          </div>
          <div className="modifySection">
            <label>Description</label>
            <input
              value={modifyProduct.Description}
              onChange={(e) =>
                setmodifyProduct({
                  ...modifyProduct,
                  Description: e.target.value,
                })
              }
            />
          </div>
          <div className="modifySection">
            <label>Quantity</label>
            <input
              value={modifyProduct.Quantity}
              onChange={(e) =>
                setmodifyProduct({ ...modifyProduct, Quantity: e.target.value })
              }
            />
          </div>
          <button onClick={Product_Modification}>Modify</button>
        </div>
      )}
      <div className="MyProducts-wrapper">
        {myProductsdata.length !== 0 &&
          myProductsdata.map((obj) => {
            return (
              <div key={obj.id} className="SingleOwnProduct">
                <button
                  className="modify-Product"
                  onClick={() =>
                    setmodifyProduct({
                      id: obj.id,
                      Title: obj.Title,
                      Price: obj.Price,
                      Description: obj.Description,
                      Quantity: obj.Quantity,
                      OnStore: obj.Onstore,
                    })
                  }
                >
                  modify
                </button>
                <p>{obj.Title}</p>
                <p>{obj.Price}</p>
                {obj.CodePromo !== null && (
                  <>
                    <p>{obj.CodePromo.Code}</p>
                    <p>{obj.CodePromo.Percentage}</p>
                  </>
                )}
                <img
                  src={`https://my-superi-app.jelastic.metropolia.fi/${obj.Images}`}
                  alt="hello"
                  className="OwnProductImage"
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default MyProducts;
