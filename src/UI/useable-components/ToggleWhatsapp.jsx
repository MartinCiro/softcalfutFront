import { MDBIcon } from "mdb-react-ui-kit";
import useWhatsAppRedirect from "@hooks/useWhatsAppRedirect";
import "@styles/Toggle.css";

const ToggleWhatsapp = ({ phone, message = '', position = 'right' }) => {
  const buildWhatsAppUrl = useWhatsAppRedirect();
  
  const handleClick = () => {
    const url = buildWhatsAppUrl(phone, message);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      className={`whatsapp-button ${position}`}
      title="Contactar por WhatsApp"
      aria-label="Chat de WhatsApp"
    >
      <MDBIcon fab icon="whatsapp" size="lg" />
    </button>
  );
};

export default ToggleWhatsapp;