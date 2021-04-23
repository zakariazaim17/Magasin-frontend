import React, { useState } from "react";
import { useParams, withRouter } from "react-router-dom";

export default function KK(props) {
  let { id } = props.match.params;

  return (
    <div>
      <h1>this is tfoo {id}</h1>
    </div>
  );
}
