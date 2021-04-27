import React, { useEffect, useState } from "react";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import Category from "../../models/Category";
import { getCategories } from "../../services/DataService";
import { gql, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import CategoryDropDown from "../CategoryDropDown";

const GetAllCategories = gql`
  query getAllCategories {
    getAllCategories {
      id
      name
    }
  }
`;

const LeftMenu = () => {
  const { width } = useWindowDimensions();
  const { loading, data, error } = useQuery(GetAllCategories);
  const [categories, setCategories] = useState<JSX.Element>(
    <div>Left Menu</div>
  );

  useEffect(() => {
    if (loading) {
      setCategories(<span>Loading...</span>);
    } else if (error) {
      setCategories(<span>Error occurred when loading categories...</span>);
    } else {
      if (data && data.getAllCategories) {
        const categories = data.getAllCategories.map((category: any) => {
          return (
            <li key={category.id}>
              <Link to={`/categorythreads/${category.id}`}>
                {category.name}
              </Link>
            </li>
          );
        });
        setCategories(<ul className="category">{categories}</ul>);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (width <= 768) {
    return (
      <div>
        <CategoryDropDown navigate={true} />
      </div>
    );
  }
  return <div className="leftmenu">{categories}</div>;
};

export default LeftMenu;
