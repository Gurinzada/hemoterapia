import { Drawer, NavLink, Button } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "../../store/store";
import styles from "./Header.module.scss";
import {
  IconMenu2,
  IconHome,
  IconUser,
  IconLogout,
  IconClock
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { clearStateUser } from "../../store/slices/userSlice";
import { useLocation } from "react-router-dom";

export default function Header() {
  const { user } = useAppSelector((state) => state.user);
  const [opened, { open, close }] = useDisclosure(false);
  const location = useLocation();
  const path = location.pathname;
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(clearStateUser());
    window.location.href = "/";
  };

  const changeTitle = () => {
    switch (path) {
      case "/home":
        return `Seja bem vindo ${user.userName}`
      case "/clients":
        return `Área Clientes`
      default:
        return ""
    }
  }

  return (
    <>
      <header className={`${styles.containerHeader}`}>
        <Button
          onClick={open}
          style={{
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: "white",
          }}
          variant="white"
          rightSection={<IconMenu2 size={16} color="#12b886" />}
        ></Button>

        <div
          style={{
            textAlign: "center",
            textOverflow: "ellipsis",
            border: "1px solid #12b886",
            borderRadius: "12px"
          }}
        >
          <h3>{changeTitle()}</h3>
        </div>
      </header>

      <Drawer
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
        opened={opened}
        onClose={close}
        title="Menu"
        padding="md"
        size={"xs"}
      >
        <NavLink
          label="Início"
          leftSection={<IconHome size={16} />}
          onClick={close}
        />
        <NavLink
          label="Clientes"
          leftSection={<IconUser size={16} />}
          href="/clients"
        />
        <NavLink
          label="Horários"
          leftSection={<IconClock size={16} />}
          href="/appoitments"
        />

        <div style={{ marginTop: "1rem" }}>
          <Button
            fullWidth
            color="red"
            leftSection={<IconLogout size={16} />}
            onClick={handleLogout}
          >
            Sair
          </Button>
        </div>
      </Drawer>
    </>
  );
}
