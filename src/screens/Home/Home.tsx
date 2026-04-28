import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import { Button } from "../../components/Button/Button";
import { Modal } from "../../components/Modal/Modal";

export default function HomeScreen() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleConfirmLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div>
      <h1>Dashboard inicial</h1>
      <Button label="Cerrar sesión" variant="red" onPress={() => setShowModal(true)} />

      {showModal && (
        <Modal
          title="Cerrar sesión"
          message="¿Estás seguro de que deseas cerrar sesión?"
          confirmText="Cerrar sesión"
          cancelText="Cancelar"
          confirmVariant="red"
          iconName="logout"
          onConfirm={handleConfirmLogout}
          onCancel={() => setShowModal(false)}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
