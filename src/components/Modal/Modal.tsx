import type { ReactNode } from "react";
import { Button } from "../Button/Button";
import { icons, type IconName } from "../../icons";

export interface ModalProps {
  title?: string;
  message?: string;
  secondaryMessage?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  showCloseIcon?: boolean;
  confirmVariant?: "blue" | "red";
  iconName?: IconName;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export const Modal = ({
  title,
  message,
  secondaryMessage,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  onClose,
  showCloseIcon = true,
  confirmVariant = "blue",
  iconName,
  children,
  footer,
  className = "",
}: ModalProps) => {
  const modalClasses = [
    "w-[440px] bg-white rounded-[15px] p-[30px] flex flex-col font-[Inter,sans-serif]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const CloseIcon = icons.close;
  const Icon = iconName ? icons[iconName] : null;

  const hasCustomContent = Boolean(children);
  const hasDefaultFooter = Boolean(onConfirm || onCancel);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6">
      <div className={modalClasses}>
        <div className="flex justify-between items-center">
          {title ? (
            <h3 className="text-[#1f4e79] text-lg font-semibold m-0">
              {title}
            </h3>
          ) : (
            <div />
          )}

          {showCloseIcon && (
            <button
              type="button"
              aria-label="Cerrar"
              className="bg-transparent border-0 cursor-pointer text-[#1f4e79] inline-flex items-center justify-center p-1"
              onClick={onClose}
            >
              <CloseIcon size={24} />
            </button>
          )}
        </div>

        <div
          className={
            hasCustomContent
              ? "my-5 flex-1"
              : "my-5 flex-1 flex flex-col justify-center items-center gap-2.5 text-center"
          }
        >
          {hasCustomContent ? (
            children
          ) : (
            <>
              {Icon && (
                <div className="mb-2.5 text-[#1f4e79] inline-flex">
                  <Icon size={40} />
                </div>
              )}

              {message && (
                <p className="text-xl text-[#1f4e79] m-0">{message}</p>
              )}

              {secondaryMessage && (
                <p className="text-lg text-[#1f4e79] m-0">
                  {secondaryMessage}
                </p>
              )}
            </>
          )}
        </div>

        {footer ? (
          <div className="flex justify-end gap-3">{footer}</div>
        ) : hasDefaultFooter ? (
          <div className="flex justify-center gap-3">
            {onCancel && (
              <Button
                variant="white"
                size="medium"
                label={cancelText}
                onPress={onCancel}
              />
            )}

            {onConfirm && (
              <Button
                variant={confirmVariant}
                size="medium"
                label={confirmText}
                onPress={onConfirm}
              />
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
