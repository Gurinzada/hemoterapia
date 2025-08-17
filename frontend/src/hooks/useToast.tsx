import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function useToast() {
  function showToastError(message: string) {
    toast.error(message, {
      position: "bottom-center",
      autoClose: 4000,
      hideProgressBar: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      transition: Bounce,
      progress: undefined,
    });
  }

  function showToastWarn(message: string) {
    toast.warn(message, {
      position: "bottom-center",
      autoClose: 4000,
      hideProgressBar: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      transition: Bounce,
      progress: undefined,
    });
  }

  function showToastSucess(message: string) {
    toast.success(message, {
      position: "bottom-center",
      autoClose: 4000,
      hideProgressBar: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      transition: Bounce,
      progress: undefined,
    });
  }


  function showToastLoading(message: string, toastId?: string) {
    return toast.loading(message, {
      position: "bottom-center",
      hideProgressBar: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      transition: Bounce,
      progress: undefined,
      toastId,
      autoClose: false
      
    });
  }

  return { showToastError, showToastWarn, showToastSucess, showToastLoading };
}
