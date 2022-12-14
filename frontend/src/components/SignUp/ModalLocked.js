import React from 'react';
import { Button, Modal } from 'semantic-ui-react';

function ModalLocked({ showModalLocked, setShowModalocked }) {
  return (
    <Modal
      centered={false}
      open={showModalLocked}
      onClose={() => setShowModalocked(false)}
      onOpen={() => setShowModalocked(true)}
      trigger={<Button>Show Modal</Button>}
    >
      <Modal.Header>Tài khoản bị khoá</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          Tài khoản của bạn đã bị khoá, vui lòng liên hệ email <b>admin@gmail.com</b> để được giải quyết
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setShowModalocked(false)}>OK</Button>
      </Modal.Actions>
    </Modal>
  );
}

export default ModalLocked;
