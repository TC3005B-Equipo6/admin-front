import type { ReactNode } from "react";
import styles from "./Modal.module.css";
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
  const modalClasses = [styles.modal, className].filter(Boolean).join(" ");
  const CloseIcon = icons.close;
  const Icon = iconName ? icons[iconName] : null;

  const hasCustomContent = Boolean(children);
  const hasDefaultFooter = Boolean(onConfirm || onCancel);

  return (
    <div className={styles.overlay}>
      <div className={modalClasses}>
        <div className={styles.header}>
          {title ? <h3 className={styles.title}>{title}</h3> : <div />}

          {showCloseIcon && (
            <button
              type="button"
              aria-label="Cerrar"
              className={styles.close}
              onClick={onClose}
            >
              <CloseIcon size={24} />
            </button>
          )}
        </div>

        <div
          className={
            hasCustomContent ? styles.contentCustom : styles.contentCentered
          }
        >
          {hasCustomContent ? (
            children
          ) : (
            <>
              {Icon && (
                <div className={styles.icon}>
                  <Icon size={40} />
                </div>
              )}

              {message && <p className={styles.message}>{message}</p>}

              {secondaryMessage && (
                <p className={styles.secondary}>{secondaryMessage}</p>
              )}
            </>
          )}
        </div>

        {footer ? (
          <div className={styles.footer}>{footer}</div>
        ) : hasDefaultFooter ? (
          <div className={styles.actions}>
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
