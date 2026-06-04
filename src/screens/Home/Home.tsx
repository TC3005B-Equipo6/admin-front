import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import { Input } from "../../components/Input/Input";
import { Modal } from "../../components/Modal/Modal";
import { getApiClient } from "../../services/api";

type UserRole = "Admin" | "Usuario";
type UserStatus = "Activo" | "Inactivo";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

interface UserResponse {
  id: string;
  firstName?: string;
  paternalSurname?: string;
  maternalSurname?: string;
  email?: string;
  active?: boolean;
  role?: {
    id: number;
    name: string;
  };
}

interface CurrentUser {
  name: string;
  role: string;
}

interface PasswordRecoveryTicket {
  id: string;
  email: string;
  status: string;
  createdAt: string;
  resolvedAt: string | null;
}

export function Home() {
  const apiClient = useMemo(() => getApiClient(), []);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"users" | "support">("users");
  const [roleFilter, setRoleFilter] = useState<"Todos" | UserRole>("Todos");

  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    name: "",
    role: "",
  });

  const [showUserMenu, setShowUserMenu] = useState(false);

  const [tickets, setTickets] = useState<PasswordRecoveryTicket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [formFirstName, setFormFirstName] = useState("");
  const [formPaternalSurname, setFormPaternalSurname] = useState("");
  const [formMaternalSurname, setFormMaternalSurname] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState<UserRole>("Usuario");
  const [formActive, setFormActive] = useState(true);

  const loadCurrentUser = async () => {
    try {
      const response = await apiClient.get("/auth/me");
      const data = response.data;

      const fullName = [
        data.firstName,
        data.paternalSurname,
        data.maternalSurname,
      ]
        .filter(Boolean)
        .join(" ");

      setCurrentUser({
        name: fullName || data.email || "Usuario",
        role: data.role?.name || "Administrador",
      });
    } catch (error) {
      console.error("Error al cargar usuario actual:", error);

      setCurrentUser({
        name: "Usuario",
        role: "Administrador",
      });
    }
  };

  const loadUsers = async () => {
    try {
      const [usersResponse, adminsResponse] = await Promise.all([
        apiClient.get<UserResponse[]>("/user"),
        apiClient.get<UserResponse[]>("/user/admin"),
      ]);

      const mergedUsers = [...usersResponse.data, ...adminsResponse.data];

      const uniqueUsers = mergedUsers.filter(
        (user, index, self) =>
          index === self.findIndex((currentUser) => currentUser.id === user.id)
      );

      setUsers(uniqueUsers.map(mapUser));
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setUsers([]);
    }
  };

  const loadTickets = async () => {
    try {
      setLoadingTickets(true);

      const response = await apiClient.get<PasswordRecoveryTicket[]>(
        "/tickets/password-recovery?status=PENDING"
      );

      setTickets(response.data);
    } catch (error) {
      console.error("Error al cargar tickets:", error);
      setTickets([]);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    loadUsers();
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (activeTab === "support") {
      loadTickets();
    }
  }, [activeTab]);

  const filteredUsers = useMemo(() => {
    if (roleFilter === "Todos") return users;
    return users.filter((user) => user.role === roleFilter);
  }, [users, roleFilter]);

  const clearForm = () => {
    setFormFirstName("");
    setFormPaternalSurname("");
    setFormMaternalSurname("");
    setFormEmail("");
    setFormRole("Usuario");
    setFormActive(true);
    setSelectedUserId(null);
    setIsEditing(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    clearForm();
  };

  const openCreateModal = () => {
    clearForm();
    setFormRole("Usuario");
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    const nameParts = user.name.split(" ");

    setFormFirstName(nameParts[0] || "");
    setFormPaternalSurname(nameParts[1] || "");
    setFormMaternalSurname(nameParts.slice(2).join(" "));
    setFormEmail(user.email);
    setFormRole(user.role);
    setFormActive(user.status === "Activo");
    setSelectedUserId(user.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSaveUser = async () => {
    try {
      if (isEditing && selectedUserId) {
        await apiClient.put(`/user/${selectedUserId}`, {
          firstName: formFirstName,
          paternalSurname: formPaternalSurname,
          maternalSurname: formMaternalSurname,
          email: formEmail,
          active: formActive,
        });
      } else {
        await apiClient.post("/user", {
          firstName: formFirstName,
          paternalSurname: formPaternalSurname,
          maternalSurname: formMaternalSurname,
          email: formEmail,
          roleId: 2,
        });
      }

      closeModal();
      await loadUsers();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    }
  };

  const handleDeleteUser = async (user: User) => {
    const confirmDelete = window.confirm(`¿Eliminar a ${user.name}?`);

    if (!confirmDelete) return;

    try {
      await apiClient.delete(`/user/${user.id}`);
      await loadUsers();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  const handleApproveTicket = async (id: string) => {
    try {
      await apiClient.put(`/tickets/password-recovery/${id}/approve`);
      await loadTickets();
    } catch (error) {
      console.error("Error al aprobar ticket:", error);
    }
  };

  const handleRejectTicket = async (id: string) => {
    try {
      await apiClient.put(`/tickets/password-recovery/${id}/reject`);
      await loadTickets();
    } catch (error) {
      console.error("Error al rechazar ticket:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-[#f3f4f6] text-[#111827] font-[Inter,sans-serif]">
      <header className="h-[72px] bg-white border-b border-[#e5e7eb] flex items-center justify-between px-8">
        <div className="flex items-end gap-2">
          <span className="text-[#0057a8] font-bold text-xl">move360</span>
          <span className="text-[#6b7280] text-sm">/ Administración</span>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowUserMenu((prev) => !prev)}
            className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-[#f3f4f6] transition"
          >
            <div className="w-10 h-10 rounded-full bg-[#064f93] text-white flex items-center justify-center text-sm font-semibold">
              {getInitials(currentUser.name || "U")}
            </div>

            <div className="text-left">
              <p className="m-0 text-sm font-semibold">
                {currentUser.name || "Cargando..."}
              </p>
              <p className="m-0 text-xs text-[#6b7280]">
                {currentUser.role || "Administrador"}
              </p>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-[#e5e7eb] rounded-xl shadow-lg p-2 z-50">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 rounded-lg text-sm text-[#dc2626] hover:bg-[#fef2f2]"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <nav className="h-12 bg-white border-b border-[#e5e7eb] flex items-center px-8 gap-6">
        <button
          className={`h-full text-sm ${
            activeTab === "users"
              ? "text-[#064f93] font-semibold border-b-2 border-[#064f93]"
              : "text-[#6b7280]"
          }`}
          onClick={() => setActiveTab("users")}
          type="button"
        >
          Usuarios
        </button>

        <button
          className={`h-full text-sm ${
            activeTab === "support"
              ? "text-[#064f93] font-semibold border-b-2 border-[#064f93]"
              : "text-[#6b7280]"
          }`}
          onClick={() => setActiveTab("support")}
          type="button"
        >
          Soporte
        </button>
      </nav>

      <section className="max-w-[980px] mx-auto pt-8 px-4">
        {activeTab === "users" ? (
          <>
            <div className="flex justify-between items-end mb-4">
              <div>
                <h1 className="text-2xl font-bold m-0">Usuarios</h1>
                <p className="text-sm text-[#6b7280] m-0">
                  Gestiona los usuarios del sistema
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  className="h-10 bg-white border border-[#d1d5db] rounded-lg px-3 text-sm"
                  value={roleFilter}
                  onChange={(event) =>
                    setRoleFilter(event.target.value as "Todos" | UserRole)
                  }
                >
                  <option value="Todos">Rol: Todos</option>
                  <option value="Admin">Admin</option>
                  <option value="Usuario">Usuario</option>
                </select>

                <Button
                  variant="blue"
                  size="medium"
                  label="+ Nuevo usuario"
                  className="w-[145px]"
                  onPress={openCreateModal}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden shadow-sm">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#f9fafb] text-[#6b7280] text-xs uppercase">
                    <th className="text-left px-5 py-4">Nombre</th>
                    <th className="text-left px-5 py-4">Rol</th>
                    <th className="text-left px-5 py-4">Estado</th>
                    <th className="text-left px-5 py-4">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-t border-[#e5e7eb]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#dbeafe] text-[#064f93] flex items-center justify-center text-xs font-semibold">
                            {getInitials(user.name)}
                          </div>

                          <div>
                            <p className="m-0 text-sm font-semibold">
                              {user.name}
                            </p>
                            <p className="m-0 text-xs text-[#6b7280]">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="bg-[#dbeafe] text-[#064f93] rounded-full px-3 py-1 text-xs font-medium">
                          {user.role}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            user.status === "Activo"
                              ? "bg-[#dcfce7] text-[#15803d]"
                              : "bg-[#f3f4f6] text-[#6b7280]"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            className="w-9 h-9 rounded-lg border border-[#d1d5db] text-[#6b7280] bg-white"
                            type="button"
                            onClick={() => handleEditUser(user)}
                          >
                            ✎
                          </button>

                          <button
                            className="w-9 h-9 rounded-lg border border-[#d1d5db] text-[#6b7280] bg-white"
                            type="button"
                            onClick={() => handleDeleteUser(user)}
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-5 py-8 text-center text-[#6b7280]"
                      >
                        No hay usuarios para mostrar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="text-right text-xs text-[#9ca3af] mt-3">
              Mostrando {filteredUsers.length} usuarios
            </p>
          </>
        ) : (
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-8 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold m-0">
                  Tickets de recuperación
                </h1>

                <p className="text-sm text-[#6b7280] mt-1">
                  Solicitudes pendientes de recuperación de contraseña
                </p>
              </div>

              <Button
                variant="white"
                size="medium"
                label="Actualizar"
                onPress={loadTickets}
              />
            </div>

            {loadingTickets ? (
              <p className="text-sm text-[#6b7280]">Cargando tickets...</p>
            ) : tickets.length === 0 ? (
              <div className="border border-dashed border-[#d1d5db] rounded-xl p-8 text-center">
                <p className="text-sm text-[#6b7280]">
                  No hay tickets pendientes.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="border border-[#e5e7eb] rounded-xl p-5 bg-[#f9fafb]"
                  >
                    <div className="flex justify-between gap-4">
                      <div>
                        <p className="m-0 text-sm font-semibold">
                          {ticket.email}
                        </p>

                        <p className="m-0 text-xs text-[#6b7280] mt-1">
                          Creado: {formatDate(ticket.createdAt)}
                        </p>

                        <span className="inline-flex mt-3 bg-[#fef3c7] text-[#92400e] rounded-full px-3 py-1 text-xs font-medium">
                          {ticket.status}
                        </span>
                      </div>

                      <div className="flex gap-2 items-start">
                        <Button
                          variant="blue"
                          size="medium"
                          label="Aprobar"
                          onPress={() => handleApproveTicket(ticket.id)}
                        />

                        <Button
                          variant="white"
                          size="medium"
                          label="Rechazar"
                          onPress={() => handleRejectTicket(ticket.id)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {isModalOpen && (
        <Modal
          title={isEditing ? "Editar usuario" : "Crear usuario"}
          onClose={closeModal}
          footer={
            <>
              <Button variant="white" label="Cancelar" onPress={closeModal} />

              <Button
                variant="blue"
                label={isEditing ? "Actualizar" : "Guardar"}
                onPress={handleSaveUser}
              />
            </>
          }
        >
          <Input
            label="Nombre"
            value={formFirstName}
            onChange={(event) => setFormFirstName(event.target.value)}
            placeholder="Nombre"
          />

          <Input
            label="Apellido paterno"
            value={formPaternalSurname}
            onChange={(event) => setFormPaternalSurname(event.target.value)}
            placeholder="Apellido paterno"
          />

          <Input
            label="Apellido materno (opcional)"
            value={formMaternalSurname}
            onChange={(event) => setFormMaternalSurname(event.target.value)}
            placeholder="Apellido materno"
          />

          <Input
            label="Correo"
            type="email"
            value={formEmail}
            onChange={(event) => setFormEmail(event.target.value)}
            placeholder="correo@ejemplo.com"
          />

          {isEditing && (
            <div className="flex flex-col gap-2 mt-2 mb-4">
              <label className="text-base font-medium text-[#1f1f1f]">
                Estado
              </label>

              <select
                className="w-full border border-black rounded-lg px-3 py-[10px] text-base bg-white"
                value={formActive ? "activo" : "inactivo"}
                onChange={(event) =>
                  setFormActive(event.target.value === "activo")
                }
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          )}
        </Modal>
      )}
    </main>
  );
}

function mapUser(user: UserResponse): User {
  const fullName = [
    user.firstName,
    user.paternalSurname,
    user.maternalSurname,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    id: user.id,
    name: fullName || "Sin nombre",
    email: user.email || "Sin correo",
    role: user.role?.id === 1 ? "Admin" : "Usuario",
    status: user.active ? "Activo" : "Inactivo",
  };
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function formatDate(value: string) {
  if (!value) return "Sin fecha";

  return new Date(value).toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}