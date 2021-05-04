import React, { useEffect, useRef, useState } from "react";

import "../css/Myproducts.css";
import { MdDelete, MdCreate } from "react-icons/md";
const ServerUrl = "https://my-superi-app.jelastic.metropolia.fi/graphql";
//const ServerUrl = "http://localhost:3004/graphql";
const MyProducts = () => {
  const [myProductsdata, setmyProductsdata] = useState([]);

  useEffect(() => {
    GetMyProducts();
  }, []);

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
          Authorization: `Bearer ${localStorage.getItem("ClientToken")}`,
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
          Authorization: `Bearer ${localStorage.getItem("ClientToken")}`,
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

  const Delete_Product = async (event) => {
    const requestbody = {
      query: ` 
        mutation {
          DeleteProducts(id:"${event}"){id}
        }`,
    };

    const deletedProduct = await fetch(ServerUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("ClientToken")}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify(requestbody),
    });

    const success_Deleted_Product = await deletedProduct.json();
    console.log(success_Deleted_Product);
    window.location.reload();
  };

  const Cancel_Product_Modification = (e) => {
    e.preventDefault();
    setmodifyProduct();
  };
  return (
    <div className="parent-Modification">
      {modifyProduct && (
        <div className="Product-modification-div">
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
          <button onClick={Product_Modification} className="modify_btn_final">
            Modify
          </button>
          <button
            onClick={Cancel_Product_Modification}
            className="Cancel_btn_final"
          >
            Cancel
          </button>
        </div>
      )}
      <div className="MyProducts-wrapper">
        {myProductsdata.length !== 0 &&
          myProductsdata.map((obj) => {
            return (
              <div key={obj.id} className="SingleOwnProduct">
                <MdCreate
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
                />

                <MdDelete
                  onClick={() => Delete_Product(obj.id)}
                  className="delete_product_btn"
                />

                <p>{obj.Title}</p>
                <p>€ {obj.Price}</p>
                <p>{obj.Description}</p>
                <p>{obj.Quantity} piece(s)</p>

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
