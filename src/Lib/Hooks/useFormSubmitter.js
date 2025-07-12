import { useNavigate } from 'react-router-dom';
import useErrorHandler from '@hooks/useErrorHandler';

const useFormSubmitter = () => {
  const navigate = useNavigate();
  const { error, handleError, resetError } = useErrorHandler();

  const submitForm = async (callbackFn, redirectPath) => {
    resetError();
    try {
      await callbackFn();  // Ejecuta la función que pase (por ejemplo: AuthService.login)
      if (redirectPath) {
        navigate(redirectPath); 
        //window.location.reload();
      }
    } catch (err) {
      handleError(err);
    }
  };

  return { submitForm, error };
};

export default useFormSubmitter;
