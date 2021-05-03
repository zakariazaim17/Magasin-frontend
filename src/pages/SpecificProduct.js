import React, { useState, useEffect } from "react";
import "../css/SpecificProduct.css";
import { FcOk } from "react-icons/fc";
import StripeCheckout from "react-stripe-checkout";
import https from "https";
import dotenv from "dotenv";
dotenv.config();
const agent = new https.Agent({
  rejectUnauthorized: false,
});

const ServerUrl = "https://my-superi-app.jelastic.metropolia.fi/graphql";

//const ServerUrl = "http://localhost:3004/graphql";
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
                         Verified
                        } 
                      Price  
                       Images
                        Description
                        Quantity
                        
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

  const EnablePurchase = async (token) => {
    const requestbody = {
      token,
      SingleProduct,
    };

    try {
      const fetchOption = {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestbody),
      };
      console.log("specificProduct", { agent }, fetchOption);
      const payment = await fetch(
        "https://my-superi-app.jelastic.metropolia.fi/magasin/paymentGateway/",
        //{ agent },
        fetchOption
      );
      console.log(payment);
      const { status } = payment;
      console.log(status);
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <div className="SpecificProductWrapper">
      {SingleProduct !== null && (
        <div>
          <img
            src={`https://my-superi-app.jelastic.metropolia.fi/${SingleProduct.Images}`}
            alt="hello"
            className="Product-image"
          />
          <div className="More-details-section">
            <p className="ProductTile">{SingleProduct.Title}</p>

            <p>
              <span>Price: </span>€ {SingleProduct.Price}
            </p>
            <p>
              <span>Description: </span>
              {SingleProduct.Description}
            </p>
            <p>
              <span>Seller: </span>
              {SingleProduct.Owner.username}{" "}
              {SingleProduct.Owner.verified === true && <FcOk />}
            </p>
            <p>
              <span>Quantity: </span>
              {SingleProduct.Quantity} piece(s)
            </p>
            <StripeCheckout
              stripeKey={process.env.REACT_APP_PUBKEY_STRIPE}
              token={EnablePurchase}
              name="Buy"
              amount={SingleProduct.Price * 100}
            >
              <button className="Buy-btn">Purchase</button>
            </StripeCheckout>
          </div>
        </div>
      )}
    </div>
  );
};
export default SpecificProduct;

//set HTTPS=true&&  please add this to the deployed version and remember to change the url in serve.js to https for socket to work
