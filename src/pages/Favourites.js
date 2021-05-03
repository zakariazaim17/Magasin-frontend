import React, { useEffect } from "react";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import "../css/Favourites.css";
const ServerUrl = "https://my-superi-app.jelastic.metropolia.fi/graphql";

const Favourites = () => {
  const [ClientFavourites, setclientfavourites] = useState([]);

  useEffect(() => {
    GetClientFavourites();
  }, []);

  const Delete_Favourite = async (data) => {
    const requestBody = {
      query: `
      mutation {
        DeleteFavourite(id:"${data}") {
              id
        }
      }`,
    };

    try {
      const deletedfavourite = await fetch(ServerUrl, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ClientToken")}`,
          "Content-type": "application/json",
        },
      });

      console.log("favourite deleted");
      window.location.reload();
    } catch (e) {
      console.log(e.message);
    }
  };

  const GetClientFavourites = async () => {
    const requestBody = {
      query: `
             query {
                GetUserFavourites(id: "${localStorage.getItem(
                  "CurentcliEnt"
                )}") {
                  id
                  
                  Products {
                    Title
                    Price
                    Images
                  }
                }
              }`,
    };

    try {
      const favourites = await fetch(ServerUrl, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ClientToken")}`,
          "Content-type": "application/json",
        },
      });
      const resultedFavourites = await favourites.json();
      console.log(resultedFavourites.data);
      setclientfavourites(resultedFavourites.data.GetUserFavourites);
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <div className="MyProducts-wrapper">
      {ClientFavourites.length !== 0 &&
        ClientFavourites.map((obj) => {
          return (
            <div key={obj.id} className="SingleOwnProduct">
              <MdDelete
                onClick={() => Delete_Favourite(obj.id)}
                className="delete_product_btn"
              />

              <p>{obj.Products.Title}</p>
              <p>€ {obj.Products.Price}</p>

              <img
                src={`https://my-superi-app.jelastic.metropolia.fi/${obj.Products.Images}`}
                alt="hello"
                className="OwnProductImage"
              />
            </div>
          );
        })}
    </div>
  );
};

export default Favourites;
