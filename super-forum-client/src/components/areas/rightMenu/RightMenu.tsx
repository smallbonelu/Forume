import React, { useEffect, useState } from "react";
import { useWindowDimensions } from "../../../hooks/useWindowDimensions";
import groupBy from "lodash/groupBy";
import TopCategory from "../rightMenu/TopCategory";
import { gql, useQuery } from "@apollo/client";

const GetTopCategoryThread = gql`
  query getTopCategoryThread {
    getTopCategoryThread {
      threadId
      categoryId
      categoryName
      title
      titleCreatedOn
    }
  }
`;

const RightMenu = () => {
  const { width } = useWindowDimensions();
  const { data: categoryThreadData } = useQuery(GetTopCategoryThread);
  const [topCategories, setTopCategories] = useState<
    Array<JSX.Element> | undefined
  >();

  useEffect(() => {
    if (categoryThreadData && categoryThreadData.getTopCategoryThread) {
      const topCategoryThreads = groupBy(
        categoryThreadData.getTopCategoryThread,
        "categoryName"
      );
      const topElements = [];
      for (let key in topCategoryThreads) {
        const currentTop = topCategoryThreads[key];
        topElements.push(<TopCategory key={key} topCategories={currentTop} />);
      }
      setTopCategories(topElements);
    }
  }, [categoryThreadData]);
  if (width <= 768) {
    return null;
  }
  return <div className="rightmenu">{topCategories}</div>;
};

export default RightMenu;
