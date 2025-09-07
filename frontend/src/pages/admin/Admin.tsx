import { useEffect, useState } from "react";
import Container from "../../components/Container";
import Header from "../../components/Header/Header";
import { UserRole, type user } from "../../utils/user";
import api from "../../api/api";
import useToast from "../../hooks/useToast";
import {
  Table,
  Paper,
  Pagination,
  Loader,
  Center,
  Text,
  Group,
  ActionIcon,
  Modal,
  TextInput,
  Button,
  Select,
} from "@mantine/core";
import { IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";

interface userPaginated {
  users: user[];
  total: number;
  page: number;
  lastPage: number;
}

export default function Admin() {
  const [page, setPage] = useState<number>(1);
  const [users, setUsers] = useState<userPaginated>({
    lastPage: 1,
    page: 1,
    total: 0,
    users: [],
  });
  const [loading, setLoading] = useState<boolean>(false);

  const { showToastError, showToastSucess } = useToast();
  const [openedEdit, setOpenedEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState<user | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [openedDelete, setOpenedDelete] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [openedCreate, setOpenedCreate] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    userName: "",
    role: UserRole.ADMIN,
    password: "",
  });

  useEffect(() => {
    fetchUsers();
  }, [page]);

  async function fetchUsers() {
    setLoading(true);
    try {
      const response = await api.get(
        `/users/findAllUsers?page=${page}&limit=10`
      );
      setUsers(response.data as userPaginated);
    } catch {
      showToastError(`Ocorreu um erro ao buscar os usuários`);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteUserId) return;
    try {
      await api.delete(`/users/${deleteUserId}`);
      showToastSucess("Usuário deletado com sucesso!");
      setOpenedDelete(false);
      fetchUsers();
      setDeleteUserId(null)
    } catch {
      showToastError("Erro ao deletar usuário");
    }
  }

  async function handleUpdatePassword() {
    if (!selectedUser) return;
    try {
      await api.patch(`/users/${selectedUser.id}/password`, {
        password: newPassword,
      });
      showToastSucess("Senha atualizada com sucesso!");
      setOpenedEdit(false);
      setSelectedUser(null);
      setNewPassword("");
    } catch {
      showToastError("Erro ao atualizar senha");
    }
  }

  async function handleCreateUser() {
    try {
      await api.post("/users/create", newUser);
      showToastSucess("Usuário criado com sucesso!");
      setOpenedCreate(false);
      setNewUser({ email: "", userName: "", role: null as unknown as UserRole, password: "" });
      fetchUsers();
    } catch {
      showToastError("Erro ao criar usuário");
    }
  }

  const rows = users.users.map((item) => (
    <Table.Tr key={item.id}>
      <Table.Td>{item.id}</Table.Td>
      <Table.Td fw={500}>{item.userName}</Table.Td>
      <Table.Td>{item.email}</Table.Td>
      <Table.Td>{item.role}</Table.Td>
      <Table.Td>
        {new Date(item.createdAt).toLocaleDateString("pt-BR")}
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon
            color="teal"
            variant="light"
            onClick={() => {
              setSelectedUser(item);
              setOpenedEdit(true);
            }}
          >
            <IconEdit size={18} />
          </ActionIcon>
          <ActionIcon
            color="red"
            variant="light"
            onClick={() => {
              setDeleteUserId(item.id);
              setOpenedDelete(true);
            }}
          >
            <IconTrash size={18} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Header />
      <Container>
        <main style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <Button
              color="teal"
              leftSection={<IconPlus size={16} />}
              onClick={() => setOpenedCreate(true)}
            >
              Novo Usuário
            </Button>
          </div>
          <Paper shadow="md" radius="lg" p="lg" withBorder>
            <Text size="xl" fw={700} mb="md">
              Gerenciamento de Usuários
            </Text>

            {loading ? (
              <Center h={200}>
                <Loader />
              </Center>
            ) : (
              <Table striped highlightOnHover withTableBorder withColumnBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>ID</Table.Th>
                    <Table.Th>Nome de Usuário</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Cargo</Table.Th>
                    <Table.Th>Data de Criação</Table.Th>
                    <Table.Th>Ações</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {rows.length > 0 ? (
                    rows
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={6}>
                        <Center>
                          <Text c="dimmed">Nenhum usuário encontrado.</Text>
                        </Center>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            )}
          </Paper>
        </main>
      </Container>

      <footer>
        <Group justify="center" mt="lg" mb="xl">
          <Pagination
            total={users.lastPage}
            value={page}
            onChange={setPage}
            size="md"
            radius="md"
            color="teal"
            withEdges
          />
        </Group>
      </footer>

      <Modal
        opened={openedEdit}
        onClose={() => setOpenedEdit(false)}
        title={`Alterar senha do usuário ${selectedUser?.userName}`}
        centered
      >
        <TextInput
          label="Nova senha"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          mb="md"
        />
        <Group justify="flex-end">
          <Button variant="default" onClick={() => {
            setOpenedEdit(false)
            setSelectedUser(null);
            setNewPassword("")
          }}>
            Cancelar
          </Button>
          <Button color="teal" onClick={handleUpdatePassword}>
            Salvar
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={openedDelete}
        onClose={() => setOpenedDelete(false)}
        title="Confirmar Exclusão"
        centered
      >
        <Text>Tem certeza que deseja excluir este usuário?</Text>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setOpenedDelete(false)}>
            Cancelar
          </Button>
          <Button color="red" onClick={handleDelete}>
            Deletar
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={openedCreate}
        onClose={() => setOpenedCreate(false)}
        title="Cadastrar Novo Usuário"
        centered
      >
        <TextInput
          label="Nome de Usuário"
          placeholder="Digite o nome"
          value={newUser.userName}
          onChange={(e) =>
            setNewUser({ ...newUser, userName: e.target.value })
          }
          mb="sm"
          withAsterisk
        />
        <TextInput
          label="Email"
          placeholder="Digite o email"
          value={newUser.email}
          onChange={(e) =>
            setNewUser({ ...newUser, email: e.target.value })
          }
          mb="sm"
          withAsterisk
        />
        <Select
          label="Cargo"
          value={newUser.role}
          onChange={(val) => setNewUser({ ...newUser, role: val as UserRole })}
          data={[
            { value: `${UserRole.ADMIN}`, label: "Admin" },
            { value: `${UserRole.MEGA}`, label: "Mega Admin" },
          ]}
          mb="sm"
          withAsterisk
        />
        <TextInput
          label="Senha"
          type="password"
          placeholder="Digite a senha"
          value={newUser.password}
          onChange={(e) =>
            setNewUser({ ...newUser, password: e.target.value })
          }
          mb="md"
          withAsterisk
        />
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setOpenedCreate(false)}>
            Cancelar
          </Button>
          <Button color="teal" onClick={handleCreateUser}>
            Cadastrar
          </Button>
        </Group>
      </Modal>
    </>
  );
}
