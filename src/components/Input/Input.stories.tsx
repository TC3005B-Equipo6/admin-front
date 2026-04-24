import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta = {
  title: "Components/Input",
  component: Input,
  decorators: [
    (Story) => (
      <div
      style={{
        minHeight: "100vh", 
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 10}}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Usuario: Story = {
  args: {
    label: "Usuario",
    placeholder: "ejemplo@move360.com",
    type: "email",
    autoComplete: "email",
  },
};

export const Contraseña: Story = {
  args: {
    label: "Contraseña",
    placeholder: "Introduce tu contraseña",
    type: "password",
  },
};