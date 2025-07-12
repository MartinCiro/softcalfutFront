import { useCallback } from 'react';

const useWhatsAppRedirect = () => {
  return useCallback((phone, message) => {
    const cleanedPhone = phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message)
      .replace(/%20/g, '+')
      .replace(/%2F/g, '/')
      .replace(/%3A/g, ':')
      .replace(/%0A/g, '%0A');

    return `https://api.whatsapp.com/send/?phone=${cleanedPhone}&text=${encodedMessage}&type=phone_number&app_absent=0`;
  }, []);
};

export default useWhatsAppRedirect;