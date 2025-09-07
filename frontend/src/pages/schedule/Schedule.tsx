import Container from "../../components/Container";
import Header from "../../components/Header/Header";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { useState } from "react";
import {
  setFieldsAppoitment,
} from "../../store/slices/newAppointment";
import ClientModal from "../../components/Modal/ClientModal";
import CardAppointment from "../../components/Card/CardAppointment";

export default function Schedule() {
  const { appointmentFields } = useAppSelector(
    (state) => state.newAppointment
  );
  const [open, setOpen] = useState<boolean>(false);
  const [nameClient, setNameClient] = useState<string>("");
  const dispatch = useAppDispatch();

  return (
    <>
      <Header />
      <Container>
        <main>
          <CardAppointment
            Title="Agendar"
            isEdit={false}
            setOpen={setOpen}
            nameClient={nameClient}
            setNameClient={setNameClient}
          />
        </main>
      </Container>
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
    </>
  );
}
