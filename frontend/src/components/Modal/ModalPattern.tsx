import { Button, Input, Modal } from "@mantine/core";
import { IconUser, IconAt, IconPhone } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  setNewClientFields,
  postNewClient,
  clearStateNewClient,
} from "../../store/slices/newClientSlice";
import { fetchMyClients } from "../../store/slices/clientsSlice";
import { Bounce, toast } from "react-toastify";
import useToast from "../../hooks/useToast";
import {
  clearEditState,
  editClient,
  setEditFields,
} from "../../store/slices/editClient";

interface ClientFormModalProps {
  opened: boolean;
  onClose: () => void;
  mode: string;
  page: number;
}

export default function ModalPattern({
  opened,
  onClose,
  mode,
  page,
}: ClientFormModalProps) {
  const dispatch = useAppDispatch();
  const { fields, loading } = useAppSelector((state) => state.newClient);
  const { editFields, editLoading } = useAppSelector(
    (state) => state.editClient
  );
  const { showToastWarn } = useToast();

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

  const handleSubmitClient = async () => {
    if (mode === "create" ? fields.userNameClient.trim() === "" : editFields.userNameClient.trim() === "") {
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
      if (mode === "create") {
        await dispatch(postNewClient({ ...fields })).unwrap();
        await dispatch(
          fetchMyClients({ limit: 10, page, clientName: "" })
        ).unwrap();
        onClose();
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
        dispatch(clearStateNewClient());
      } else {
        await dispatch(editClient({ ...editFields })).unwrap();
        await dispatch(
          fetchMyClients({ limit: 10, page, clientName: "" })
        ).unwrap();
        onClose();
        toast.update(id, {
          render: "Cliente Editado com sucesso.",
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
        dispatch(clearEditState());
      }
    } catch {
      toast.update(id, {
        render:
          mode === "create"
            ? "Ocorreu um erro ao cadastrar cliente"
            : "Ocorreu um erro ao editar cliente",
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
    <Modal
      title={mode === "create" ? "Cadastrar Cliente" : "Editar Cliente"}
      opened={opened}
      onClose={onClose}
    >
      <Modal.Body
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <Input.Wrapper label="Nome Cliente" withAsterisk>
          <Input
            placeholder="Digite o Nome do Cliente"
            value={
              mode === "create"
                ? fields.userNameClient
                : editFields.userNameClient
            }
            onChange={(e) =>
              mode === "create"
                ? dispatch(
                    setNewClientFields({
                      ...fields,
                      userNameClient: e.target.value,
                    })
                  )
                : dispatch(
                    setEditFields({
                      ...editFields,
                      userNameClient: e.target.value,
                    })
                  )
            }
            leftSection={<IconUser size={14} />}
          />
        </Input.Wrapper>

        <Input.Wrapper label="Email Cliente">
          <Input
            placeholder="Digite o Email do Cliente"
            value={
              mode === "create" ? fields.emailClient : editFields.emailClient
            }
            onChange={(e) =>
              mode === "create"
                ? dispatch(
                    setNewClientFields({
                      ...fields,
                      emailClient: e.target.value,
                    })
                  )
                : dispatch(
                    setEditFields({
                      ...editFields,
                      emailClient: e.target.value,
                    })
                  )
            }
            leftSection={<IconAt size={14} />}
          />
        </Input.Wrapper>

        <Input.Wrapper label="Contato Cliente">
          <Input
            placeholder="Digite o número do Cliente"
            value={mode === "create" ? fields.phoneClient : editFields.phoneClient}
            inputMode="numeric"
            onChange={(e) =>
              mode === "create"
                ? dispatch(
                    setNewClientFields({
                      ...fields,
                      phoneClient: formatPhone(e.target.value),
                    })
                  )
                : dispatch(
                    setEditFields({
                      ...editFields,
                      phoneClient: formatPhone(e.target.value),
                    })
                  )
            }
            leftSection={<IconPhone size={14} />}
          />
        </Input.Wrapper>

        <Button
          onClick={handleSubmitClient}
          fullWidth
          variant="outline"
          color="teal"
          loading={
            mode === "create"
              ? loading === "pending"
                ? true
                : false
              : editLoading === "pending"
              ? true
              : false
          }
        >
          {mode === "create" ? "Cadastrar" : "Salvar alterações"}
        </Button>
      </Modal.Body>
    </Modal>
  );
}
