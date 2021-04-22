import React, { useEffect, useState } from "react";
const ServerUrl = "http://localhost:3004/graphql";
const Categories = () => {
  const [CAtegoryDAta, setCAtegoryDAte] = useState([]);
  useEffect(() => {
    GetallCategories();
  }, []);
  const GetallCategories = async () => {
    const requestbody = {
      query: `
            query{
                GetCategories{
                    Name
                     TotalItems
                      Images
                    }
                }`,
    };

    try {
      const Categories = await fetch(ServerUrl, {
        method: "POST",
        body: JSON.stringify(requestbody),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (Categories.status !== 200 && Categories.status !== 201) {
        throw new Error("Failed");
      }
      const CategoriesREsults = await Categories.json();
      setCAtegoryDAte(CategoriesREsults.data.GetCategories);
      console.log(CategoriesREsults.data);
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <div>
      <p>yes</p>
      {CAtegoryDAta.length !== 0 &&
        CAtegoryDAta.map((obj) => {
          return (
            <div key={obj.Name}>
              <p>{obj.Name}</p>
              <img
                src={`http://localhost:3004/${obj.Images}`}
                alt="hello"
                width="100px"
                height="100px"
              />
            </div>
          );
        })}
    </div>
  );
};

export default Categories;
