import {
  Card,
  Input,
  NumberInput,
  Select,
  InputWrapper,
  Checkbox,
  Button,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  IconUser,
  IconCalendar,
  IconMoneybag,
  IconCash,
  IconStatusChange,
} from "@tabler/icons-react";
import {
  createAppointment,
  getAnAppointment,
  setFieldsAppoitment,
  updateAnAppointment,
} from "../../store/slices/newAppointment";
import { AppointmentStatus } from "../../utils/appointment";
import styles from "../../pages/schedule/Schedule.module.scss";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { Bounce, toast } from "react-toastify";
import useToast from "../../hooks/useToast";
import { useEffect } from "react";
import { fetchMyAppointments } from "../../store/slices/appointmentSlice";

interface CardAppointmentProps {
  isEdit: boolean;
  Title: string;
  setOpen: (value: boolean) => void;
  nameClient: string;
  setNameClient: (value: string) => void;
  id?: number;
  page?:number;
}

export default function CardAppointment({
  Title,
  isEdit,
  setOpen,
  nameClient,
  setNameClient,
  id,
  page
}: CardAppointmentProps) {
  const dispatch = useAppDispatch();
  const { appointmentFields, loading } = useAppSelector(
    (state) => state.newAppointment
  );
  const { showToastWarn } = useToast();

  useEffect(() => {
    if (isEdit === true && id) {
      dispatch(getAnAppointment(id));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkFields = () => {
    if (
      appointmentFields.clientid === null ||
      appointmentFields.date.trim() === "" ||
      appointmentFields.status.trim() === "" ||
      appointmentFields.appointmentValue === null
    ) {
      showToastWarn(`Complete os campos Obrigatórios`);
      return;
    }
  };

  const handleSubmit = async () => {
    checkFields();
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

  const handleUpdate = async () => {
    const loadingToast = toast.loading(`Atualizando Hemoterapia...`, {
      position: "bottom-center",
      autoClose: 4000,
      hideProgressBar: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      transition: Bounce,
      progress: undefined,
    });
    toast.update(loadingToast, {
      isLoading: false,
      type: "success",
      render: "Hemoterapia Atualizada com Sucesso!",
      autoClose: 4000,
      position: "bottom-center",
      hideProgressBar: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      transition: Bounce,
      progress: undefined,
    });
    try {
      await dispatch(
        updateAnAppointment({ appointment: appointmentFields, id: Number(id) })
      ).unwrap();
      await dispatch(fetchMyAppointments({limit: 10, page: Number(page)})).unwrap()
    } catch {
      toast.update(loadingToast, {
        render: "Ocorreu um erro ao atualizar Hemoterapia!",
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
    <Card shadow="sm" radius={"md"} padding={"xl"}>
      <Card.Section>
        <div style={{ textAlign: "center" }}>
          {Title}
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
          onClick={isEdit ? handleUpdate : handleSubmit}
        >
          {isEdit ? "Atualizar" : "Marcar"}
        </Button>
      </Card.Section>
    </Card>
  );
}
