import { useEffect, useState } from "react";
import Container from "../../components/Container";
import Header from "../../components/Header/Header";
import { fetchMyClients } from "../../store/slices/clientsSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { Button, Input, Modal, Pagination } from "@mantine/core";
import useToast from "../../hooks/useToast";
import {
  postNewClient,
  setNewClientFields,
} from "../../store/slices/newClientSlice";
import { Bounce, toast } from "react-toastify";
import { IconAt, IconUser, IconPhone } from "@tabler/icons-react";

export default function Client() {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const { client } = useAppSelector((state) => state.clients);
  const { error, fields, loading } = useAppSelector((state) => state.newClient);
  const { showToastWarn } = useToast();

  useEffect(() => {
    dispatch(fetchMyClients({ limit: 10, page: 1 }));
  }, []);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");

    if (!numbers) return "";

    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
        7
      )}`;

    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
      7,
      11
    )}`;
  };

  const handleNextPage = async (page: number) => {
    await dispatch(fetchMyClients({ limit: 10, page })).unwrap();
  };

  const handleSubmitClient = async () => {
    if (fields.userNameClient.trim() === "") {
      showToastWarn(`Campo "Nome do Cliente" necessita ser preenchido!`);
      return;
    }

    const id = toast.loading("Enviando Informações", {
      position: "bottom-center",
      autoClose: 4000,
      hideProgressBar: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      transition: Bounce,
      progress: undefined,
    });

    try {
      await dispatch(postNewClient({...fields})).unwrap();
      await dispatch(fetchMyClients({ limit: 10, page })).unwrap();
      setOpen(false);
      toast.update(id, {
        render: "Cliente Cadastrado com sucesso",
        type: "success",
        autoClose: 4000,
        hideProgressBar: true,
        isLoading: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
        progress: undefined,
      });
    } catch {
      toast.update(id, {
        render: "Ocorreu um erro ao Cadastrar o Cliente",
        type: "error",
        autoClose: 4000,
        hideProgressBar: true,
        pauseOnHover: true,
        isLoading: false,
        draggable: true,
        theme: "light",
        transition: Bounce,
        progress: undefined,
      });
    }
  };

  return (
    <>
      <Header />
      <Container>
        <main>
          <section>
            <Button variant="filled" color="teal" onClick={() => setOpen(true)}>
              Cadastrar Cliente
            </Button>
          </section>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
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
        </main>

        <Modal
          title="Cadastrar Cliente"
          onClose={() => setOpen(false)}
          opened={open}
        >
          <Modal.Body
            style={{
              display: "grid",
              flexDirection: "column",
              gridTemplateColumns: "1fr",
              gridTemplateRows: "repeat(4, 1fr)",
              gap: "1rem",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div>
              <Input.Wrapper label="Nome Cliente" withAsterisk>
                <Input
                  placeholder="Digite o Nome do Cliente"
                  value={fields.userNameClient}
                  onChange={(e) =>
                    dispatch(
                      setNewClientFields({
                        ...fields,
                        userNameClient: e.target.value,
                      })
                    )
                  }
                  leftSection={<IconUser size={14}/>}
                />
              </Input.Wrapper>
            </div>
            <div>
              <Input.Wrapper label="Email Cliente">
                <Input
                  placeholder="Digite o Email do Cliente"
                  value={fields.emailClient}
                  onChange={(e) =>
                    dispatch(
                      setNewClientFields({
                        ...fields,
                        emailClient: e.target.value,
                      })
                    )
                  }
                  leftSection={<IconAt size={14}/>}
                />
              </Input.Wrapper>
            </div>
            <div>
              <Input.Wrapper label="Contato Cliente">
                <Input
                  placeholder="Digite o número do Cliente"
                  value={fields.phoneClient}
                  inputMode="numeric"
                  onChange={(e) =>
                    dispatch(
                      setNewClientFields({
                        ...fields,
                        phoneClient: formatPhone(e.target.value),
                      })
                    )
                  }
                  leftSection={<IconPhone size={14}/>}
                />
              </Input.Wrapper>
            </div>
            <div>
              <Button onClick={handleSubmitClient} fullWidth variant="outline" color="teal">
                Cadastrar
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
}
