import { Button, useDisclosure, Modal, ModalContent, ModalBody, ModalFooter } from '@heroui/react';

type ModelConfirmProps = {
  title?: string;
  description?: string;
  onConfirm: (onClose: () => void) => void;
  children: React.ReactNode;
}

export default function ModelConfirm(props: ModelConfirmProps) {
  const { title, description, onConfirm, children } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div>
      <Button
        onPress={onOpen}
        size="sm" variant="light" color="danger"
      >{children}</Button>
      <Modal isOpen={isOpen}>
        <ModalContent>
          <ModalBody>
            <p className='text-lg font-bold'>{title}</p>
            <p className='text-sm text-gray-500'>{description}</p>
          </ModalBody>
          <ModalFooter>
            <Button color="default" onPress={onClose}>取消</Button>
            <Button color="secondary" onPress={() => {
              onConfirm(onClose);
            }}>确定</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}