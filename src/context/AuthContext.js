import React from "react";

export default React.createContext({
  token: null,
  id: null,
  login: (token, id) => {},
  logout: () => {},
});
