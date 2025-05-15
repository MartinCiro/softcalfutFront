import { MDBIcon } from "mdb-react-ui-kit";
import useScrollTopButton from "@hooks/useScrollTopButton";
import "@styles/Toggle.css";

const ScrollTopButton = () => {
  const { showButton, scrollToTop } = useScrollTopButton();

  if (!showButton) return null;

  return (
    <button
      onClick={scrollToTop}
      className="btnUp"
      title="Ir arriba"
    >
      <MDBIcon fas icon="arrow-up" />
    </button>
  );
};

export default ScrollTopButton;
