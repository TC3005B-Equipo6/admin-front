import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./Modal";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const ConfirmacionEnvio: Story = {
  args: {
    message: "Se ha enviado tu ticket de soporte al administrador.",
    secondaryMessage: "En breve recibirás noticias.",
    confirmText: "Aceptar",
    onConfirm: () => {},
    iconName: "checkCircle",
  },
};

export const SesionExpirada: Story = {
  args: {
    title: "SESIÓN EXPIRADA",
    message: "Su sesión ha expirado",
    secondaryMessage: "Inicie sesión nuevamente",
    confirmText: "Aceptar",
    onConfirm: () => {},
  },
};

export const CerrarSesion: Story = {
  args: {
    message: "¿Desea cerrar la sesión?",
    confirmText: "Salir",
    cancelText: "Cancelar",
    onConfirm: () => {},
    onCancel: () => {},
    confirmVariant: "red",
  },
};

export const EliminarIndicador: Story = {
  args: {
    message: "¿Eliminar indicador?",
    secondaryMessage: "Esta acción no se puede deshacer",
    confirmText: "Eliminar",
    cancelText: "Cancelar",
    onConfirm: () => {},
    onCancel: () => {},
    confirmVariant: "red",
  },
};
