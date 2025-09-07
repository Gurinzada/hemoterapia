import { Modal, Pagination } from "@mantine/core";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchMyClients } from "../../store/slices/clientsSlice";
import styles from "../../pages/schedule/Schedule.module.scss";

interface SelectClientModalProps {
  opened: boolean;
  onClose: () => void;
  onSelect: (id: number, name: string) => void;
}

export default function ClientModal({
  opened,
  onClose,
  onSelect,
}: SelectClientModalProps) {
  const { client } = useAppSelector((state) => state.clients);
  const [page, setPage] = useState<number>(1);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (opened) {
      dispatch(fetchMyClients({ clientName: "", limit: 10, page: 1 }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  const handleNextPage = async (page: number) => {
    setPage(page);
    await dispatch(fetchMyClients({ limit: 10, page, clientName: "" })).unwrap();
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Selecione o Cliente" centered>
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
              key={item.id}
              className={`${styles.containerNameOptions}`}
              onClick={() => {
                onSelect(item.id, item.userNameClient);
                onClose();
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
  );
}
