import React, { useEffect, useState } from "react";
import { Button, Container, Form, Message, Segment } from "semantic-ui-react";
import Axios from "axios";

function ResetScreen() {
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [emailChecked, setEmailChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await Axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/reset`, {
        email,
      });
      setEmailChecked(true);
    } catch (error) {
      setErrorMsg(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    !errorMsg && setTimeout(() => setErrorMsg(null), 5000);
  }, [errorMsg]);

  return (
    <>
      <Container style={{ paddingTop: "1rem" }} text>
        {emailChecked ? (
          <Message
            attached
            icon="mail"
            header="Đã gửi email khôi phục"
            content="Vui lòng kiểm tra trong hộp thư của bạn để tiến hành khôi phục tài khoản"
            success
          />
        ) : (
          <Message
            attached
            icon="settings"
            header="Khôi phục mật khẩu"
            color="teal"
          />
        )}

        <Form
          loading={loading}
          onSubmit={resetPassword}
          error={errorMsg !== null}
        >
          <Message error header="Lỗi!" content={errorMsg} />

          <Segment>
            <Form.Input
              fluid
              icon="mail outline"
              type="email"
              iconPosition="left"
              label="Email"
              placeholder="Nhập địa chỉ email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />

            <Button
              disabled={loading || email.length === 0}
              icon="configure"
              type="submit"
              color="orange"
              content="Khôi phục"
            />
          </Segment>
        </Form>
      </Container>
    </>
  );
}

export default ResetScreen;
