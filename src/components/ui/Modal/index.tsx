import { ModalRoot } from "./ModalRoot";

import { ModalContent } from "./ModalContent";
import { ModalHeader } from "./ModalHeader";
import { ModalFooter } from "./ModalFooter";
import { useModalState } from "./useModalState";
import { useModal } from "./ModalRoot";

export const Modal = {
  Root: ModalRoot,
  Content: ModalContent,
  Header: ModalHeader,
  Footer: ModalFooter,
};

export { useModalState, useModal };
