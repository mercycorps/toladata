import { useCallback, useState } from "react";

// returns a callback to get the bounding box of the container, and a translate function
// which uses that width and height to center the tree horizontally and place the tree near the top
// of the bounding box (20px down to make room for text)
export const useCenteredTree = (defaultTranslate = { x: 0, y: 0 }) => {
  const [translate, setTranslate] = useState(defaultTranslate);
  const containerRef = useCallback((containerElem) => {
    if (containerElem !== null) {
      const { width, height } = containerElem.getBoundingClientRect();
      setTranslate({ x: width / 2 + 20, y: 20 });
    }
  }, []);
  return [translate, containerRef];
};


