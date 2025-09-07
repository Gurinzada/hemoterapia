import { useEffect, useState } from "react";
import Container from "../../components/Container";
import Header from "../../components/Header/Header";
import { useAppDispatch, useAppSelector } from "../../store/store";
import Loading from "../../components/Loading/Loading";
import { fetchMyAppointments } from "../../store/slices/appointmentSlice";
import {
  Accordion,
  Badge,
  Button,
  Card,
  Modal,
  Pagination,
} from "@mantine/core";
import {
  IconTrash,
  IconEdit,
  IconWallet,
  IconStatusChange,
  IconMoneybag,
  IconCalendar,
  IconInfoCircle,
} from "@tabler/icons-react";
import styles from "../clients/Client.module.scss";
import {
  clearAppointmentFields,
  setFieldsAppoitment,
} from "../../store/slices/newAppointment";
import CardAppointment from "../../components/Card/CardAppointment";
import ClientModal from "../../components/Modal/ClientModal";
import type { appointment } from "../../utils/appointment";
import { Bounce, toast } from "react-toastify";
import api from "../../api/api";

export default function Home() {
  const { appointments, loading } = useAppSelector(
    (state) => state.appointments
  );
  const { appointmentFields } = useAppSelector((state) => state.newAppointment);
  const dispatch = useAppDispatch();
  const [page, setPage] = useState<number>(1);
  const [nameClient, setNameClient] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [id, setId] = useState<number>(null as unknown as number);
  const [openExclude, setOpenExclude] = useState<boolean>(false);
  const [appointmentInfo, setAppoitmentInfo] = useState<appointment | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchMyAppointments({ limit: 10, page: 1 }));
    dispatch(clearAppointmentFields());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancelOpenExcludeModal = () => {
    setAppoitmentInfo(null);
    setOpenExclude(false);
  };

  const handleDeleteClient = async (id: number) => {
    const loading = toast.loading(`Excluindo agendamento...`, {
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

      await api.delete(`appointment/${id}`);
      toast.update(loading, {
        isLoading: false,
        type: "success",
        render: "Agendamento excluído com sucesso!",
        autoClose: 4000,
        position: "bottom-center",
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
        progress: undefined,
      });
      setAppoitmentInfo(null);
      setOpenExclude(false);
      await dispatch(fetchMyAppointments({ limit: 10, page: 1 })).unwrap();
    } catch  {
      toast.update(loading, {
        render: "Ocorreu um erro ao excluir o agendamento!",
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


  const handleNextPage = async (page: number) => {
    setPage(page);
    await dispatch(fetchMyAppointments({ limit: 10, page })).unwrap();
  };

  if (loading === "pending") {
    return <Loading />;
  }

  return (
    <>
      <Header />
      <Container>
        <main
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignContent: "center",
          }}
        >
          <section style={{ marginBottom: "0.5rem" }}>
            <h2>Últimas Hemoterapias</h2>
          </section>
          {appointments.appointments.length === 0 ? (
            <p>Ainda não foi marcada nenhuma Hemoterapia</p>
          ) : (
            <Accordion
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {appointments.appointments.map((item) => (
                <Accordion.Item key={item.date} value={item.date}>
                  <Accordion.Control
                    style={{
                      borderBottom: "1px solid #000",
                      background: "none",
                    }}
                  >
                    <Badge
                      size="lg"
                      color="gray"
                      leftSection={<IconCalendar size={14} />}
                      style={{ fontWeight: 600 }}
                    >
                      {item.date}
                    </Badge>
                  </Accordion.Control>
                  <Accordion.Panel style={{ background: "white" }}>
                    <section
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        marginTop: "0.5rem",
                      }}
                    >
                      {item.appointment.map((client) => (
                        <Card
                          withBorder
                          shadow="sm"
                          radius={"md"}
                          padding={"lg"}
                          key={client.id}
                        >
                          <header
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "0.5rem",
                            }}
                          >
                            <h3>{client.client.userNameClient}</h3>
                            <IconTrash size={14} color="#fa5252" onClick={() => {
                              setAppoitmentInfo(client);
                              setOpenExclude(true);
                            }}/>
                          </header>
                          <main
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.5rem",
                            }}
                          >
                            <div className={`${styles.info}`}>
                              <div className={`${styles.iconWithTitle}`}>
                                <IconMoneybag size={14} />
                                <h5>Valor: </h5>
                              </div>
                              <span className={`${styles.textSpan}`}>
                                {" "}
                                R${client.appointmentValue}
                              </span>
                            </div>
                            <div className={`${styles.info}`}>
                              <div className={`${styles.iconWithTitle}`}>
                                <IconWallet size={14} />
                                <h5>Forma de Pagamento: </h5>
                              </div>
                              <span className={`${styles.textSpan}`}>
                                {client.paymentMethod}
                              </span>
                            </div>
                            <div className={`${styles.info}`}>
                              <div className={`${styles.iconWithTitle}`}>
                                <IconStatusChange size={14} />
                                <h5>Status: </h5>
                              </div>
                              <span className={`${styles.textSpan}`}>
                                {" "}
                                {client.status}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "end",
                              }}
                            >
                              <Badge color={client.paid ? "teal" : "red"}>
                                {client.paid ? "Pago" : "Pendente"}
                              </Badge>
                            </div>
                          </main>
                          <footer>
                            <Button
                              style={{
                                textAlign: "center",
                                marginTop: "0.5rem",
                              }}
                              leftSection={<IconEdit size={14} />}
                              variant="outline"
                              color="teal"
                              fullWidth
                              onClick={() => {
                                setId(client.id);
                                setNameClient(client.client.userNameClient);
                                setOpenModal(true);
                              }}
                            >
                              Editar
                            </Button>
                          </footer>
                        </Card>
                      ))}
                    </section>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          )}
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
              total={appointments.lastPage || 1}
              value={page}
              onChange={(page) => handleNextPage(page)}
            />
          </div>
        </main>
        <Modal opened={openModal} onClose={() => setOpenModal(false)}>
          <CardAppointment
            isEdit={true}
            Title="Editar Agendamento"
            setOpen={setOpen}
            nameClient={nameClient}
            setNameClient={setNameClient}
            id={id}
            page={page}
          />
        </Modal>
        <ClientModal
          opened={open}
          onClose={() => setOpen(false)}
          onSelect={(id, name) => {
            dispatch(
              setFieldsAppoitment({
                ...appointmentFields,
                clientid: id,
              })
            );
            setNameClient(name);
          }}
        />
      </Container>
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
                Ao clicar em Excluir, este agendamento não irá mais existir.
              </p>
            </div>
            <div>
              <Button
                variant="outline"
                color="red"
                onClick={() => handleDeleteClient(Number(appointmentInfo?.id))}
                fullWidth
              >
                Excluir
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
