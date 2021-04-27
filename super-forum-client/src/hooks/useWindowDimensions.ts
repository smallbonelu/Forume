import { useState, useEffect } from "react";

export interface WindowDimension {
  height: number;
  width: number;
}

export const useWindowDimensions = (): WindowDimension => {
  const [dimension, setDemension] = useState<WindowDimension>({
    height: 0,
    width: 0,
  });

  const handleResize = () => {
    setDemension({
      height: window.innerHeight,
      width: window.innerWidth,
    });
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return dimension;
};
