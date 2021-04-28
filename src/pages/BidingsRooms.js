import React, { useEffect, useRef, useState } from "react";
import "../css/BidingsRooms.css";
import io from "socket.io-client";
//const ServerUrl = "http://localhost:3004/graphql";
const ServerUrl = "https://my-superi-app.jelastic.metropolia.fi/graphql";

const BidingsRooms = (props) => {
  let { id } = props.match.params;

  const socketRef = useRef();

  const [singleBid, setsingleBid] = useState(null);

  const [chat, setchat] = useState([]);
  const messagecontent = useRef();

  console.log("user joined room", id);

  useEffect(() => {
    socketRef.current = io.connect(
      "https://my-superi-app.jelastic.metropolia.fi/"
    );
    socketRef.current.emit("room", id);
    socketRef.current.on("group message", (msg) => {
      if (chat.length === 8) {
        chat.splice(0, 1);
        setchat([...chat, msg]);
      } else {
        setchat([...chat, msg]);
      }
    });
    return () => socketRef.current.disconnect();
  }, [chat]);

  useEffect(() => {
    GetBiding();
  });

  const handlemessagesubmit = (e) => {
    e.preventDefault();

    const data = {
      name: "zaki",
      content: messagecontent.current.value,
      room: id,
    };

    socketRef.current.emit("group message", data);
    messagecontent.current.value = "";
  };

  const GetBiding = async () => {
    const requestbody = {
      query: `
          query {
            GetBidingByID(id:"${id}") {
              id
              Title
              Initialprice
              Images
              Owner {
                username
              }
              
            }
          }`,
    };

    try {
      const bid = await fetch(ServerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestbody),
      });
      if (bid.status !== 200 && bid.status !== 201) {
        throw new Error("Failed");
      }
      const resultbid = await bid.json();
      console.log(resultbid.data.GetBidingByID);
      setsingleBid(resultbid.data.GetBidingByID);
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <div className="parent">
      <div className="info">
        <p>this will be room for each biding</p>
        {singleBid !== null && (
          <div>
            <p>{singleBid.Title}</p>
            <p>{singleBid.Initialprice}</p>
            <img
              src={`https://my-superi-app.jelastic.metropolia.fi/${singleBid.Images}`}
              alt="hello"
            />
          </div>
        )}
      </div>
      <div className="biding-panel">
        <form id="group">
          <input type="text" id="message_in_room" ref={messagecontent} />
          <button onClick={handlemessagesubmit}>Send</button>
        </form>
        group chat:
      </div>
      <div className="messages">
        {chat.length !== 0 &&
          chat.map((obj, index) => {
            return (
              <div key={index}>
                <p>{obj.content}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default BidingsRooms;
