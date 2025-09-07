import { useEffect, useState } from "react";
import Container from "../../components/Container";
import Header from "../../components/Header/Header";
import { fetchMyClients } from "../../store/slices/clientsSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { Button, Card, Input, Modal, Pagination } from "@mantine/core";
import useToast from "../../hooks/useToast";
import {
  IconAt,
  IconUser,
  IconPhone,
  IconCalendar,
  IconSearch,
  IconTrash,
  IconEdit,
  IconInfoCircle,
} from "@tabler/icons-react";
import styles from "./Client.module.scss";
import api from "../../api/api";
import type { client } from "../../utils/client";
import type { user } from "../../utils/user";
import ModalPattern from "../../components/Modal/ModalPattern";
import { findOneClient } from "../../store/slices/editClient";

export default function Client() {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<string>("");
  const [openExclude, setOpenExclude] = useState<boolean>(false);
  const [clientInfo, setClientInfo] = useState<client>({
    appointment: [],
    createdAt: new Date(),
    emailClient: "",
    id: null as unknown as number,
    deletedAt: null,
    updatedAt: new Date(),
    phoneClient: "",
    user: null as unknown as user,
    userNameClient: "",
  });
  const { client } = useAppSelector((state) => state.clients);
  const { showToastSucess, showToastError } = useToast();

  useEffect(() => {
    dispatch(fetchMyClients({ limit: 10, page: 1, clientName: "" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNextPage = async (page: number) => {
    setPage(page);
    await dispatch(
      fetchMyClients({ limit: 10, page, clientName: "" })
    ).unwrap();
  };

  const handleDeleteClient = async (id: number) => {
    try {
      const response = await api.delete(`/clients/${id}`);
      if (response.status === 200) {
        showToastSucess("Cliente excluído com sucesso!");
        await dispatch(fetchMyClients({ limit: 10, page: 1, clientName: "" }));
        setOpenExclude(false);
        setClientInfo({
          appointment: [],
          createdAt: new Date(),
          emailClient: "",
          id: null as unknown as number,
          deletedAt: null,
          updatedAt: new Date(),
          phoneClient: "",
          user: null as unknown as user,
          userNameClient: "",
        });
        return;
      }
    } catch {
      showToastError(
        "Ocorreu um erro ao excluir o cliente. Por favor tente novamente."
      );
      return;
    }
  };

  const handleOpenExcludeModal = (myClient: client) => {
    setClientInfo(myClient);
    setOpenExclude(true);
  };

  const handleCancelOpenExcludeModal = () => {
    setClientInfo({
      appointment: [],
      createdAt: new Date(),
      emailClient: "",
      id: null as unknown as number,
      deletedAt: null,
      updatedAt: new Date(),
      phoneClient: "",
      user: null as unknown as user,
      userNameClient: "",
    });
    setOpenExclude(false);
  };

  const handleGetMyUser = async (id: number) => {
    await dispatch(findOneClient({ id }));
    setMode("edit");
    setOpen(true);
  };

  return (
    <>
      <Header />
      <Container>
        <main style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <Button
              size="sm"
              variant="filled"
              color="teal"
              onClick={() => {
                setMode("create");
                setOpen(true);
              }}
            >
              Cadastrar Cliente
            </Button>
            <Input
              size="sm"
              type="text"
              placeholder="Pesquisar Cliente"
              rightSection={<IconSearch size={14} />}
              onInput={(e) =>
                dispatch(
                  fetchMyClients({
                    limit: 10,
                    page,
                    clientName: (e.target as HTMLInputElement).value,
                  })
                )
              }
            />
          </section>
          <section style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: "0.5rem" }}>
              <h2>Clientes</h2>
            </div>
            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                flexWrap: "wrap",
                alignContent: "center",
              }}
            >
              {client.clients.map((client) => (
                <Card
                  shadow="sm"
                  key={client.id}
                  padding={"lg"}
                  radius={"md"}
                  withBorder
                  style={{
                    display: "flex",
                    gap: "0.9rem",
                    width: "100%",
                  }}
                  className={`${styles.card}`}
                >
                  <header style={{ textAlign: "center" }}>
                    <h3>Informações do Cliente</h3>
                  </header>
                  <main
                    style={{
                      display: "flex",
                      gap: "1rem",
                      flexDirection: "column",
                    }}
                  >
                    <div className={`${styles.info}`}>
                      <div className={`${styles.iconWithTitle}`}>
                        <IconUser size={14} />
                        <h5>Nome: </h5>
                      </div>{" "}
                      <span className={`${styles.textSpan}`}>
                        {client.userNameClient}
                      </span>
                    </div>
                    <div className={`${styles.info}`}>
                      <div className={`${styles.iconWithTitle}`}>
                        <IconAt size={14} />
                        <h5>Email: </h5>
                      </div>
                      <span className={`${styles.textSpan}`}>
                        {client.emailClient || "Não informado"}
                      </span>
                    </div>
                    <div className={`${styles.info}`}>
                      <div className={`${styles.iconWithTitle}`}>
                        <IconPhone size={14} />
                        <h5>Contato: </h5>
                      </div>{" "}
                      <span className={`${styles.textSpan}`}>
                        {client.phoneClient || "Não Informado"}
                      </span>
                    </div>
                    <div className={`${styles.info}`}>
                      <div className={`${styles.iconWithTitle}`}>
                        <IconCalendar size={14} />
                        <h5>Cadastro: </h5>
                      </div>{" "}
                      <span className={`${styles.textSpan}`}>
                        {new Date(client.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </main>
                  <footer
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                      marginTop: "0.3rem",
                    }}
                  >
                    <Button
                      style={{ textAlign: "center" }}
                      leftSection={<IconEdit size={14} />}
                      variant="outline"
                      color="teal"
                      onClick={() => handleGetMyUser(client.id)}
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleOpenExcludeModal(client)}
                      style={{ textAlign: "center" }}
                      leftSection={<IconTrash size={14} />}
                      variant="outline"
                      color="red"
                    >
                      Excluir
                    </Button>
                  </footer>
                </Card>
              ))}
            </div>
          </section>
        </main>
        <ModalPattern
          mode={mode}
          onClose={() => setOpen(false)}
          opened={open}
          page={page}
        />
        <Modal
          opened={openExclude}
          onClose={() => handleCancelOpenExcludeModal()}
          title={`Certeza da Exclusão?`}
        >
          <Modal.Body>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                alignContent: "center",
                justifyContent: "center",
              }}
            >
              <div>
                <IconInfoCircle size={20} color="#fa5252" />
                <p style={{ textAlign: "center", fontWeight: "600" }}>
                  Ao clicar em Excluir, todas as informações relacionadas a este
                  cliente não poderão ser mais acessadas por meio deste
                  aplicativo.
                </p>
              </div>
              <div>
                <Button
                  variant="outline"
                  color="red"
                  onClick={() => handleDeleteClient(clientInfo.id)}
                  fullWidth
                >
                  Excluir
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </Container>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "flex-end",
        }}
      >
        <Pagination
          color="teal"
          radius={"md"}
          withControls={false}
          total={client.lastPage || 1}
          value={page}
          onChange={(page) => handleNextPage(page)}
        />
      </div>
    </>
  );
}
