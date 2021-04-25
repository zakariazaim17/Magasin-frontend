import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Select from "react-select";
import "../css/Profile.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ServerUrl = "http://localhost:3004/graphql";

const Profile = () => {
  const ProductTitle = useRef();
  const ProductPrice = useRef();
  const [ProductCategory, setProductCategory] = useState();
  const ProductQuantity = useRef();

  const ProductCodePromo = useRef();

  const ProductCodePromoPercent = useRef();
  const ProductDescription = useRef();
  const [currentUser, setcurrentUser] = useState(null);
  const [expirydate, setexpirydate] = useState(new Date());
  const [CodePromoID, setCodePromoID] = useState();
  const [ProductImgUrl, setProductImgUrl] = useState();

  console.log(
    `${expirydate.getFullYear()}/${
      expirydate.getUTCMonth() + 1
    }/${expirydate.getUTCDate()}`
  );
  const Expiration = `${expirydate.getFullYear()}/${
    expirydate.getUTCMonth() + 1
  }/${expirydate.getUTCDate()}`;
  const [newUser, setNewUser] = useState({
    photo: "",
  });

  const options = [
    { value: "animals", label: "animals" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  useEffect(() => {
    GetClientData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("photo", newUser.photo);
    try {
      const addedImg = await axios.post(
        "http://localhost:3004/magasin/uploadphoto/",
        formData
      );
      const imgid = await addedImg.data;
      setProductImgUrl(imgid);
      console.log(imgid);
    } catch (e) {
      console.log(e.message);
    }
  };

  const AddProduct = async () => {
    /*  console.log(
      ProductTitle.current.value,
      ProductImgUrl,
      ProductPrice,
      ProductQuantity,
      ProductDescription,
      ProductCategory,
      CodePromoID,
      localStorage.getItem("CurentcliEnt")
    );*/
    const requestbody = {
      query: `
      mutation {
        AddProduct(
          Title: "${ProductTitle.current.value}"
          Price: ${ProductPrice.current.value}
          Category: "${ProductCategory}"
          Description: "${ProductDescription.current.value}"
          Quantity: ${ProductQuantity.current.value}
          CodePromo: "${CodePromoID}"
          Owner: "${localStorage.getItem("CurentcliEnt")}"
          Images: "${ProductImgUrl}"
        ){id Title OnStore}
      }`,
    };

    if (ProductImgUrl) {
      try {
        const addedProduct = await fetch(ServerUrl, {
          method: "POST",
          body: JSON.stringify(requestbody),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (addedProduct.status !== 200 && addedProduct.status !== 201) {
          throw new Error("Failed");
        }

        const succesfulProductinsert = await addedProduct.json();
        if (succesfulProductinsert.data.AddProduct.OnStore) {
          window.location.reload();
        }
      } catch (e) {
        console.log(e.message);
      }
    }
  };

  const handlePhoto = (e) => {
    setNewUser({ ...newUser, photo: e.target.files[0] });
  };

  const handleCodePromoSubmission = async () => {
    const requestbody = {
      query: `
          mutation{
            AddDiscount(
              Percentage:${ProductCodePromoPercent.current.value},
               Code:"${ProductCodePromo.current.value}",
               Expiry:"${Expiration}"
                )
                {
                  id
                  Expiry
                }
              }`,
    };
    try {
      const resultedPromo = await fetch(ServerUrl, {
        method: "POST",
        body: JSON.stringify(requestbody),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (resultedPromo.status !== 200 && resultedPromo.status !== 201) {
        throw new Error("Failed");
      }

      const succesfulPromo = await resultedPromo.json();
      setCodePromoID(succesfulPromo.data.AddDiscount.id);
      console.log(succesfulPromo.data.AddDiscount.id);
    } catch (e) {
      console.log(e.message);
    }
  };

  const GetClientData = async () => {
    const requestBody = {
      query: `
      query{
        GetClientById(
          id:"${localStorage.getItem("CurentcliEnt")}"
          ){
            id
             username
              Email
               Totalproducts
                Joined
                 Verified
                  ClientLevel
                }
              }`,
    };

    try {
      const resultedClient = await fetch(ServerUrl, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ClientToken")}`,
          "Content-Type": "application/json",
        },
      });
      if (resultedClient.status !== 200 && resultedClient.status !== 201) {
        throw new Error("Failed");
      }

      const Client = await resultedClient.json();
      setcurrentUser(Client.data.GetClientById);
      console.log(Client.data.GetClientById);
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <div>
      <h1>this is Profile</h1>
      <br></br>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="file"
          accept=".png, .jpg, .jpeg"
          name="photo"
          onChange={handlePhoto}
        />
        <input type="submit" />
        <div>
          <label>Title</label>
          <input type="text" ref={ProductTitle} />
        </div>
        <div>
          <label>Description</label>
          <input type="text" ref={ProductDescription} />
        </div>
        <div>
          <label>Price</label>
          <input type="text" ref={ProductPrice} />
        </div>
        <div>
          <label>Quantity</label>
          <input type="text" ref={ProductQuantity} />
        </div>
        <div>
          <p>Add codePromo to your product</p>
          <label>Code</label>
          <input type="text" placeholder="code" ref={ProductCodePromo} />
          <label>Percentage</label>
          <input
            type="text"
            placeholder="Pecentage"
            ref={ProductCodePromoPercent}
          />
          <label>Pick expiry date</label>
          <DatePicker
            dateFormat="yyyy/MM/dd"
            selected={expirydate}
            onChange={(date) => setexpirydate(date)}
          />
          <button onClick={handleCodePromoSubmission}>add Promo</button>
        </div>
        <div>
          <p>Choose your Product Category </p>
          <Select
            options={options}
            className="select"
            onChange={(val) => setProductCategory(val.value)}
          />
        </div>
        <button onClick={AddProduct}>Add Product</button>
      </form>
      <br></br>

      <br></br>

      <br></br>
      {currentUser !== null && (
        <div>
          <p>{currentUser.Email}</p>
          <p>{currentUser.Joined}</p>
          <p>{currentUser.Totalproducts}</p>
          <p>{currentUser.Verified}</p>
          <p>{currentUser.username}</p>
        </div>
      )}
      <br></br>
    </div>
  );
};

export default Profile;
