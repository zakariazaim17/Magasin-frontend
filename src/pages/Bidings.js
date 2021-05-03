import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import "../css/Bidings.css";
import axios from "axios";
import { FcStart } from "react-icons/fc";
import { FaBeer } from "react-icons/fa";
import { ImUsers } from "react-icons/im";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ServerUrl = "https://my-superi-app.jelastic.metropolia.fi/graphql";
//const ServerUrl = "http://localhost:3004/graphql";
const Bidings = () => {
  const [AllBidings, setAllBidings] = useState([]);
  const [AddBiding, setAddBiding] = useState();
  const Bid_Title = useRef();
  const Bid_Initial_Price = useRef();
  const Bid_Images = useRef();
  const [BidImgUrl, setBidImgUrl] = useState();
  const [addvisible, setaddvisible] = useState();

  const [newImg, setnewImg] = useState({
    photo: "",
  });

  useEffect(() => {
    GetBidings();
  }, []);

  const GetBidings = async () => {
    const requestbody = {
      query: `query {
      GetBidings {
        id
        Title
        Initialprice
        Images
        participants
        Owner {
          username
        }

      }
    }`,
    };

    try {
      const resultedBidings = await fetch(ServerUrl, {
        method: "POST",
        body: JSON.stringify(requestbody),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ClientToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (resultedBidings.status !== 200 && resultedBidings.status !== 201) {
        throw new Error("Failed");
      }

      const Bidings = await resultedBidings.json();
      console.log(Bidings.data.GetBidings);
      setAllBidings(Bidings.data.GetBidings);
    } catch (e) {
      console.log(e.message);
    }
  };

  const CreateBiding = async () => {
    // UploadBidImg();

    const requestbody = {
      query: `
        mutation {
          AddBiding(
            Title: "${Bid_Title.current.value}"
            Initialprice: ${Bid_Initial_Price.current.value}
            Images: "${BidImgUrl}"
            Owner: "${localStorage.getItem("CurentcliEnt")}"
            participants: 0
          ) {
            Title
          }
        }`,
    };
    try {
      console.log(Bid_Title, Bid_Initial_Price, Bid_Images);
      const createdBid = await fetch(ServerUrl, {
        method: "POST",
        body: JSON.stringify(requestbody),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ClientToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (createdBid.status !== 200 && createdBid.status !== 201) {
        throw new Error("Failed");
      }
      setAddBiding();
      const result_Bid = await createdBid.json();
      console.log(result_Bid);
      toast.success("successful", { autoClose: 500 });
      window.location.reload();
    } catch (err) {
      console.log(err.message);
    }
  };

  const handlePhoto = (e) => {
    setnewImg({ ...newImg, photo: e.target.files[0] });
  };

  const UploadBidImg = async (e) => {
    const formData = new FormData();
    formData.append("photo", newImg.photo);
    try {
      const addedImg = await axios.post(
        "https://my-superi-app.jelastic.metropolia.fi/magasin/uploadphoto/",
        formData
      );
      const imgid = await addedImg.data;
      setBidImgUrl(imgid);
      setaddvisible(true);
      console.log(imgid);
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <div className="main-wrapper">
      <div className="Add_Bid_trigger">
        <button
          onClick={() => setAddBiding("Enabled")}
          disabled={AddBiding === "Enabled" ? true : false}
        >
          Create
        </button>
      </div>
      {AddBiding && (
        <div className="Create_Biding_section">
          <div className="bidSection">
            <input placeholder="Title" ref={Bid_Title} />
          </div>
          <div className="bidSection">
            <input
              placeholder="Initial Price"
              ref={Bid_Initial_Price}
              type="Number"
            />
          </div>
          <div className="bidSection">
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              name="photo"
              onChange={handlePhoto}
            />
            {newImg.photo && !addvisible && (
              <button onClick={() => UploadBidImg()}>add Image</button>
            )}
          </div>

          {addvisible && (
            <button className="Add_Bid_btn" onClick={() => CreateBiding()}>
              confirm
            </button>
          )}
          <button className="Cancel_Bid_btn" onClick={() => setAddBiding()}>
            Cancel
          </button>
        </div>
      )}
      <div className="Bidings_Section">
        {AllBidings.length !== 0 &&
          AllBidings.map((obj) => {
            return (
              <NavLink
                key={obj.id}
                to={`/bidings/${obj.id}`}
                className="Single_Bid_section"
              >
                <img
                  src={`https://my-superi-app.jelastic.metropolia.fi/${obj.Images}`}
                  alt="hello"
                  className="Bid_img"
                />

                <div className="parent_section">
                  <div className="Started_section">
                    <p>
                      <FcStart /> Bid Started
                    </p>
                  </div>
                  <p>{obj.Title}</p>
                  <div className="Initial_price_section">
                    <p>Starts:€ {obj.Initialprice}</p>
                  </div>
                </div>
              </NavLink>
            );
          })}
      </div>
    </div>
  );
};

export default Bidings;
