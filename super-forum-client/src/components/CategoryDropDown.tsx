import React, { FC, useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import Category from "../models/Category";
import { AppState } from "../store/AppState";
import DropDown, { Option } from "react-dropdown";
import { useHistory } from "react-router-dom";

const defaultLabel = "Select a category";
const defaultOptions = {
  value: "0",
  label: defaultLabel,
};

class CategoryDropDownProps {
  sendOutSelectedCategory?: (cat: Category) => void;
  navigate?: boolean = false;
  preselectedCategory?: Category;
  disabled?: boolean = false;
}

const CategoryDropDown: FC<CategoryDropDownProps> = ({
  sendOutSelectedCategory,
  navigate,
  preselectedCategory,
  disabled,
}) => {
  const categories = useSelector((state: AppState) => state.categories);
  const [categoryOptions, setCategoryOptions] = useState<
    Array<string | Option>
  >([defaultOptions]);
  const [selectedOption, setSelectedOption] = useState<Option>(defaultOptions);
  const history = useHistory();

  useEffect(() => {
    if (categories) {
      const catOptions = categories.map((cat: Category) => {
        return {
          value: cat.id,
          label: cat.name,
        };
      });
      setCategoryOptions(catOptions);

      setSelectedOption({
        value: preselectedCategory ? preselectedCategory.id : "0",
        label: preselectedCategory ? preselectedCategory.name : defaultLabel,
      });
    }
  }, [categories, preselectedCategory]);

  const onChangeDropDown = (selected: Option) => {
    setSelectedOption(selected);
    if (sendOutSelectedCategory) {
      sendOutSelectedCategory(
        new Category(selected.value, selected.label?.valueOf().toString() ?? "")
      );
    }

    if (navigate) {
      history.push(`/categorythreads/${selected.value}`);
    }
  };
  return (
    <DropDown
      className="thread-category-dropdown"
      onChange={onChangeDropDown}
      value={selectedOption}
      options={categoryOptions}
      placeholder={defaultLabel}
      disabled={disabled}
    ></DropDown>
  );
};

export default CategoryDropDown;
