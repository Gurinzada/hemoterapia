import {
  Button,
  Card,
  Checkbox,
  Input,
  InputWrapper,
  Modal,
  NumberInput,
  Pagination,
  Select,
} from "@mantine/core";
import Container from "../../components/Container";
import Header from "../../components/Header/Header";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { useEffect, useState } from "react";
import { fetchMyClients } from "../../store/slices/clientsSlice";
import {
  IconUser,
  IconCalendar,
  IconMoneybag,
  IconCash,
  IconStatusChange,
} from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import { AppointmentStatus } from "../../utils/appointment";
import styles from "./Schedule.module.scss";
import {
  createAppointment,
  setFieldsAppoitment,
} from "../../store/slices/newAppointment";
import useToast from "../../hooks/useToast";
import { Bounce, toast } from "react-toastify";

export default function Schedule() {
  const { client } = useAppSelector((state) => state.clients);
  const { appointmentFields, loading } = useAppSelector(
    (state) => state.newAppointment
  );
  const [open, setOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [nameClient, setNameClient] = useState<string>("");
  const dispatch = useAppDispatch();
  const { showToastWarn } = useToast();

  useEffect(() => {
    dispatch(fetchMyClients({ clientName: "", limit: 10, page: 1 }));
  }, []);

  const handleNextPage = async (page: number) => {
    setPage(page);
    await dispatch(
      fetchMyClients({ limit: 10, page, clientName: "" })
    ).unwrap();
  };

  const handleSubmit = async () => {
    if (
      appointmentFields.clientid === null ||
      appointmentFields.date.trim() === "" ||
      appointmentFields.status.trim() === "" ||
      appointmentFields.appointmentValue === null
    ) {
      showToastWarn(`Complete os campos Obrigatórios`);
      return;
    }
    const loadingToast = toast.loading(`Marcando Hemoterapia...`, {
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
      await dispatch(createAppointment({ ...appointmentFields })).unwrap();
      toast.update(loadingToast, {
        isLoading: false,
        type: "success",
        render: "Hemoterapia Marcada com Sucesso!",
        autoClose: 4000,
        position: "bottom-center",
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
        progress: undefined,
      });
      setNameClient("");
    } catch {
      toast.update(loadingToast, {
        render: "Ocorreu um erro ao marcar Hemoterapia!",
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
          <Card shadow="sm" radius={"md"} padding={"xl"}>
            <Card.Section>
              <div style={{ textAlign: "center" }}>
                <h2>Marcar Horário</h2>
                <h3>Agendamento de Clientes</h3>
              </div>
            </Card.Section>
            <Card.Section>
              <div className={`${styles.containerInputs}`}>
                <Input.Wrapper label={"Cliente"} withAsterisk>
                  <Input
                    type="text"
                    placeholder="Selecione o Cliente"
                    leftSection={<IconUser size={14} />}
                    onClick={() => setOpen(true)}
                    value={nameClient}
                    readOnly={true}
                  />
                </Input.Wrapper>
              </div>
              <div className={`${styles.containerInputs}`}>
                <Input.Wrapper label={"Data"} withAsterisk>
                  <DateInput
                    valueFormat="DD/MM/YYYY"
                    leftSection={<IconCalendar size={14} />}
                    value={appointmentFields.date}
                    onChange={(e) =>
                      dispatch(
                        setFieldsAppoitment({
                          ...appointmentFields,
                          date: e as string,
                        })
                      )
                    }
                  />
                </Input.Wrapper>
              </div>
              <div className={`${styles.containerInputs}`}>
                <Input.Wrapper label={"Valor R$"} withAsterisk>
                  <NumberInput
                    hideControls
                    decimalSeparator=","
                    thousandSeparator="."
                    prefix="R$ "
                    allowNegative={false}
                    leftSection={<IconMoneybag size={14} />}
                    onChange={(e) =>
                      dispatch(
                        setFieldsAppoitment({
                          ...appointmentFields,
                          appointmentValue: e as number,
                        })
                      )
                    }
                    value={appointmentFields.appointmentValue}
                  />
                </Input.Wrapper>
              </div>
              <div className={`${styles.containerInputs}`}>
                <Input.Wrapper label={"Meio de Pagamento"}>
                  <Select
                    placeholder="Selecione o meio de pagamento"
                    data={["Crédito", "Débito", "Dinheiro", "Pix"]}
                    leftSection={<IconCash size={14} />}
                    onChange={(e) =>
                      dispatch(
                        setFieldsAppoitment({
                          ...appointmentFields,
                          paymentMethod: e as string,
                        })
                      )
                    }
                    value={appointmentFields.paymentMethod}
                  />
                </Input.Wrapper>
              </div>
              <div className={`${styles.containerInputs}`}>
                <InputWrapper>
                  <Checkbox
                    color="teal"
                    label={"Hemoterapia foi paga?"}
                    checked={appointmentFields.paid}
                    onChange={(e) =>
                      dispatch(
                        setFieldsAppoitment({
                          ...appointmentFields,
                          paid: e.target.checked,
                        })
                      )
                    }
                  />
                </InputWrapper>
              </div>
              <div className={`${styles.containerInputs}`}>
                <Input.Wrapper label={"Status"} withAsterisk>
                  <Select
                    onChange={(e) =>
                      dispatch(
                        setFieldsAppoitment({
                          ...appointmentFields,
                          status: e as AppointmentStatus,
                        })
                      )
                    }
                    value={appointmentFields.status}
                    placeholder="Selecione o status"
                    data={Object.values(AppointmentStatus)}
                    leftSection={<IconStatusChange size={14} />}
                  />
                </Input.Wrapper>
              </div>
            </Card.Section>
            <Card.Section className={`${styles.containerInputs}`}>
              <Button
                loading={loading === "pending" ? true : false}
                fullWidth
                color="teal"
                variant="outline"
                onClick={handleSubmit}
              >
                Marcar Hemoterapia
              </Button>
            </Card.Section>
          </Card>
        </main>
      </Container>
      <Modal
        opened={open}
        onClose={() => setOpen(false)}
        title="Selecione o Cliente"
        centered
      >
        <Modal.Body
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          {client.clients.length === 0 ? (
            <p>Nenhum Cliente Disponível</p>
          ) : (
            client.clients.map((item) => (
              <div
                className={`${styles.containerNameOptions}`}
                onClick={() => {
                  dispatch(
                    setFieldsAppoitment({
                      ...appointmentFields,
                      clientid: item.id,
                    })
                  );
                  setNameClient(item.userNameClient);
                  setOpen(false);
                }}
              >
                {item.userNameClient}
              </div>
            ))
          )}
          <Pagination
            radius={"md"}
            color="teal"
            total={client.lastPage || 1}
            value={page}
            onChange={(page) => handleNextPage(page)}
            siblings={2}
            mt={"md"}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}
