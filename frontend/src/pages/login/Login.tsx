import axios from "axios";
import Container from "../../components/Container";
import useToast from "../../hooks/useToast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { showToastSucess, showToastError, showToastWarn } = useToast();
  const [userInfos, setUserInfos] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmitLogin = async (e: React.FormEvent) => {
    const isEmpty = Object.values(userInfos).some(
      (value) => value.trim() === ""
    );
    if (isEmpty) {
      return showToastWarn("Complete os campos para realizar o Login");
    }
    try {
      e.preventDefault();
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL_BACKEND}users/login`,
        {
          email: userInfos.email,
          password: userInfos.password,
        },
        {
          headers: {
            "Content-Type": "Application/json",
          },
        }
      );
      if (response.status === 201) {
        localStorage.setItem("token", response.data.token);
        showToastSucess("Login realizado com sucesso");
        setTimeout(() => {
          navigate("/home");
        }, 4500);
      }
    } catch {
      return showToastError("Email ou Senha incorretas");
    }
  };

  return (
    <>
      <Container>
        <div></div>
      </Container>
    </>
  );
}
