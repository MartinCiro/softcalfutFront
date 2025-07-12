import { useEffect, useState } from "react";

const useScrollTopButton = (offset = 300) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowButton(window.scrollY > offset);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [offset]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return { showButton, scrollToTop };
};

export default useScrollTopButton;
