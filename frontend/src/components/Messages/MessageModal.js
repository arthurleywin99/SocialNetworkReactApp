import React, { useEffect, useState } from "react";
import { Form, Modal, Segment } from "semantic-ui-react";

function MessageModal({
  setShowNewMessageModel,
  showNewMessageModal,
  profile,
  user,
  socket,
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setShowNewMessageModel(false);
  };

  const handleSendSubmit = (e) => {
    e.preventDefault();

    socket.current.emit("sendMsgFromNotification", {
      senderId: user._id,
      receiverId: profile.user._id,
      message: text,
    });

    socket.current.on("msgSentFromNotification", () => {
      setShowNewMessageModel(false);
    });
  };

  return (
    <>
      <Modal
        size="small"
        open={showNewMessageModal}
        onClose={handleClose}
        closeIcon
        closeOnDimmerClick
      >
        <Modal.Header content={`Gửi tin nhắn mới cho ${profile.user.name}`} />
        <Modal.Content>
          <div style={{ postion: "sticky", bottom: "0" }}>
            <Segment secondary color="teal" attached="bottom">
              <Form reply onSubmit={handleSendSubmit}>
                <Form.Input
                  size="large"
                  placeholder="Gửi tin nhắn mới"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  action={{
                    color: "blue",
                    icon: "telegram plane",
                    disabled: text === "",
                    loading: loading,
                  }}
                />
              </Form>
            </Segment>
          </div>
        </Modal.Content>
      </Modal>
    </>
  );
}

export default MessageModal;
