import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Select from "react-select";
import "../css/Profile.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdCreate } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ServerUrl = "https://my-superi-app.jelastic.metropolia.fi/graphql";
//const ServerUrl = "https://localhost:8000/graphql";

toast.configure();

const Profile = () => {
  const ProductTitle = useRef();
  const ProductPrice = useRef();
  const [ProductCategory, setProductCategory] = useState();
  const ProductQuantity = useRef();
  const [firstPhase, setfirstPhase] = useState(true);
  const [secondPhase, setsecondPhase] = useState(false);
  const [thirdPhase, setthirdPhase] = useState(false);

  const [inputenabeled, setinputenabled] = useState(true);

  const [promoselectation, setpromoSelection] = useState();
  const [expiryselection, setexpiryselection] = useState(null);

  const ProductCodePromo = useRef();

  const ProductCodePromoPercent = useRef();
  const ProductDescription = useRef();
  const [currentUser, setcurrentUser] = useState(null);
  const [expirydate, setexpirydate] = useState(new Date());
  const [CodePromoID, setCodePromoID] = useState(null);
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
    { value: "sports&hobbies", label: "Sport & Hobbies" },
    { value: "home&kitchen", label: "Home & Kitchen" },
    { value: "fashion&clothing", label: "Fashion & Clothing" },
    { value: "electronics", label: "Electronics" },
    { value: "arts&crafts", label: "Arts & Crafts" },
    { value: "automotive", label: "Automotive" },
    { value: "beauty&self-care", label: "Beauty & Self-Care" },
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
        "https://my-superi-app.jelastic.metropolia.fi/magasin/uploadphoto/",
        formData
      );
      const imgid = await addedImg.data;
      setProductImgUrl(imgid);
      console.log(imgid);
      setfirstPhase(false);
      setsecondPhase(true);
    } catch (e) {
      console.log(e.message);
    }
  };

  const InputsChecker = () => {
    if (
      ProductImgUrl &&
      ProductCategory &&
      ProductDescription.current.value &&
      ProductPrice.current.value &&
      ProductTitle.current.value &&
      ProductQuantity.current.value
    ) {
      return true;
    } else {
      return toast("missing inputs");
    }
  };

  const AddProduct = async (e) => {
    e.preventDefault();
    const requestbody = CodePromoID
      ? {
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
        }
      : {
          query: `
    mutation {
      AddProduct(
        Title: "${ProductTitle.current.value}"
        Price: ${ProductPrice.current.value}
        Category: "${ProductCategory}"
        Description: "${ProductDescription.current.value}"
        Quantity: ${ProductQuantity.current.value}
        CodePromo: ${CodePromoID}
        Owner: "${localStorage.getItem("CurentcliEnt")}"
        Images: "${ProductImgUrl}"
      ){id Title OnStore}
    }`,
        };

    if (InputsChecker()) {
      try {
        const addedProduct = await fetch(ServerUrl, {
          method: "POST",
          body: JSON.stringify(requestbody),
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ClientToken")}`,
            "Content-Type": "application/json",
          },
        });

        if (addedProduct.status !== 200 && addedProduct.status !== 201) {
          throw new Error("Failed and tfoo");
        }

        const succesfulProductinsert = await addedProduct.json();
        if (succesfulProductinsert.data.AddProduct.OnStore) {
          notifySuccess();

          window.location.reload();
        }
      } catch (e) {
        console.log(e.message);
      }
    }
    return false;
  };

  const handlePhoto = (e) => {
    setNewUser({ ...newUser, photo: e.target.files[0] });
  };

  const handleCodePromoSubmission = async (e) => {
    e.preventDefault();
    const requestbody =
      expiryselection === "with expiry"
        ? {
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
          }
        : {
            query: `
          mutation{
            AddDiscount(
              Percentage:${ProductCodePromoPercent.current.value},
               Code:"${ProductCodePromo.current.value}",
               Expiry:"1970/01/02"
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
          Authorization: `Bearer ${localStorage.getItem("ClientToken")}`,
          "Content-Type": "application/json",
        },
      });
      if (resultedPromo.status !== 200 && resultedPromo.status !== 201) {
        throw new Error("Failed");
      }

      const succesfulPromo = await resultedPromo.json();
      setCodePromoID(succesfulPromo.data.AddDiscount.id);
      console.log(succesfulPromo.data.AddDiscount.id);
      setfirstPhase(false);
      setsecondPhase(false);
      setthirdPhase(true);
    } catch (e) {
      console.log(e.message);
    }
  };

  const ModifyInfo = async (e) => {
    const requestbody = {
      query: `
  mutation {
    UpdateClient(
      id: "${localStorage.getItem("CurentcliEnt")}"
      username: "${currentUser.username}"
      Email: "${currentUser.Email}"
    ) {
      id
      username
      Email
      Joined
    }
  }`,
    };

    try {
      console.log(currentUser.username, currentUser.Email);
      const updatedUser = await fetch(ServerUrl, {
        method: "POST",
        body: JSON.stringify(requestbody),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ClientToken")}`,
          "Content-Type": "application/json",
        },
      });

      const results_Updated = await updatedUser.json();
      console.log(results_Updated);
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

  const notifySuccess = () => {
    toast.success("successful", { autoClose: 2000 });
  };

  return (
    <div className="main-wrapper">
      {currentUser !== null && (
        <div className="Client_Info_section">
          <div>
            <label>Username</label>
            <input
              value={currentUser.username}
              disabled={inputenabeled}
              onChange={(e) =>
                setcurrentUser({ ...currentUser, username: e.target.value })
              }
            />
          </div>
          <div>
            <label>Email</label>
            <input
              value={currentUser.Email}
              disabled={inputenabeled}
              onChange={(e) =>
                setcurrentUser({ ...currentUser, Email: e.target.value })
              }
            />
          </div>
          <div>
            <label>totalProducts</label>
            <p>{currentUser.Totalproducts}</p>
          </div>
          <div>
            <label>Joined</label>
            <p>{currentUser.Joined}</p>
          </div>
          <div>
            <label>Account verification</label>
            <p>{currentUser.Verified.toString()}</p>
            {inputenabeled && (
              <MdCreate
                onClick={() => setinputenabled(false)}
                className="edit_icon"
              />
            )}
            {!inputenabeled && (
              <button
                className="Cancel_modification_btn"
                onClick={() => setinputenabled(true)}
              >
                Cancel
              </button>
            )}

            {!inputenabeled && (
              <button className="Modify_info_btn" onClick={ModifyInfo}>
                Edit
              </button>
            )}
          </div>
        </div>
      )}

      <form
        //onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="Add_Product_section"
      >
        <span>Add Product</span>
        {firstPhase && !secondPhase && !thirdPhase && (
          <div>
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              name="photo"
              onChange={handlePhoto}
            />
            <button onClick={handleSubmit}>Post</button>
          </div>
        )}
        {secondPhase && !firstPhase && !thirdPhase && (
          <div>
            <div>
              <p>Choose your Product Category </p>
              <Select
                options={options}
                className="select"
                onChange={(val) => setProductCategory(val.value)}
              />
            </div>

            <div onChange={(val) => setpromoSelection(val.target.value)}>
              <input type="radio" value="with promo" name="add promo" />
              with promo
              <input
                type="radio"
                value="without promo"
                name="add promo"
                defaultChecked="true"
              />
              no promo
            </div>

            {promoselectation === "with promo" && (
              <div>
                <p>Add codePromo to your product</p>
                <label>Code</label>
                <input type="text" placeholder="code" ref={ProductCodePromo} />
                <label>Percentage</label>
                <input
                  type="Number"
                  placeholder="Pecentage"
                  ref={ProductCodePromoPercent}
                />
                <div onChange={(val) => setexpiryselection(val.target.value)}>
                  <input type="radio" value="with expiry" name="add expiry" />
                  with expiry
                  <input
                    type="radio"
                    value="without expiry"
                    name="add expiry"
                    defaultChecked="true"
                  />
                  no expiry
                </div>
                {expiryselection === "with expiry" && (
                  <>
                    <label>Pick expiry date</label>
                    <DatePicker
                      dateFormat="yyyy/MM/dd"
                      selected={expirydate}
                      onChange={(date) => setexpirydate(date)}
                    />
                  </>
                )}

                {ProductCategory && (
                  <button onClick={handleCodePromoSubmission}>add Promo</button>
                )}
              </div>
            )}
            {promoselectation !== "with promo" && ProductCategory && (
              <button
                onClick={() => {
                  setfirstPhase(false);
                  setthirdPhase(true);
                }}
              >
                Continue
              </button>
            )}
          </div>
        )}

        {thirdPhase && (
          <div>
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
              <input type="Number" ref={ProductPrice} />
            </div>
            <div>
              <label>Quantity</label>
              <input type="Number" ref={ProductQuantity} />
            </div>
            <button onClick={AddProduct}>Add Product</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;
