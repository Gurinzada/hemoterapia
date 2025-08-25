import axios from "axios";
import Container from "../../components/Container";
import useToast from "../../hooks/useToast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Input } from "@mantine/core";
import { IconAt, IconPassword } from "@tabler/icons-react";
import sering from "../../assets/syringe.png";

export default function Login() {
  const { showToastSucess, showToastError, showToastWarn } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
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
    setLoading(true);
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
        setLoading(false);
        setTimeout(() => {
          navigate("/home");
        }, 4500);
      }
    } catch {
      setLoading(false);
      return showToastError("Email ou Senha incorretas");
    }
  };

  return (
    <>
      <Container>
        <main style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
          <Card shadow="sm" radius={"md"} padding={"xl"} style={{display: "flex", gap: "1rem"}}>
            <Card.Section>
              <div style={{textAlign: "center"}}>
                <img src={sering} alt="" style={{width: "20%"}}/>
                <h2>Bem vindo a sua Agenda</h2>
                <h3>Faça seu Login</h3>
              </div>
            </Card.Section>
            <Card.Section>
              <div style={{padding: "1rem"}}>
                <Input
                type="email"
                placeholder="Digite seu email"
                leftSection={<IconAt size={16} />}
                onChange={(e) => setUserInfos({
                  ...userInfos,
                  email: e.target.value 
                })}
              />
              </div>
              <div style={{padding: "1rem"}}>
                <Input
                  type="password"
                  placeholder="Digite sua senha"
                  leftSection={<IconPassword size={16}/>}
                  onChange={(e) => setUserInfos({
                    ...userInfos,
                    password: e.target.value
                  })}
                />
              </div>
            </Card.Section>
            <Card.Section>
              <div style={{padding: "1rem"}}>
                <Button disabled={loading} onClick={handleSubmitLogin} color="teal" variant="outline" fullWidth>Login</Button>
              </div>
            </Card.Section>
          </Card>
        </main>
      </Container>
    </>
  );
}
