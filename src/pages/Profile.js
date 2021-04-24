import React, { useEffect, useState } from "react";
import axios from "axios";
const ServerUrl = "http://localhost:3004/graphql";

const Profile = () => {
  const [currentUser, setcurrentUser] = useState(null);

  const [newUser, setNewUser] = useState({
    photo: "",
  });

  useEffect(() => {
    GetClientData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("photo", newUser.photo);

    axios
      .post("http://localhost:3004/magasin/uploadphoto/", formData)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePhoto = (e) => {
    setNewUser({ ...newUser, photo: e.target.files[0] });
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
      </form>
      {currentUser !== null && (
        <div>
          <p>{currentUser.Email}</p>
          <p>{currentUser.Joined}</p>
          <p>{currentUser.Totalproducts}</p>
          <p>{currentUser.Verified}</p>
          <p>{currentUser.username}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
