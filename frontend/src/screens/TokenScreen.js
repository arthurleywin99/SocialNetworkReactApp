import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Divider,
  Form,
  Message,
  Segment,
} from "semantic-ui-react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";

function TokenScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = [...location.pathname.split("/")].at(-1);

  const [newPassword, setNewPassword] = useState({ field1: "", field2: "" });

  const { field1, field2 } = newPassword;

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    !errorMsg && setTimeout(() => setErrorMsg(null), 5000);
  }, [errorMsg]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPassword((prev) => ({ ...prev, [name]: value }));
  };

  const resetPassword = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      if (field1 !== field2) {
        return setErrorMsg("Mật khẩu không khớp");
      }

      await Axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/reset/token`, {
        password: field1,
        token,
      });

      setSuccess(true);
    } catch (error) {
      setErrorMsg(error.message);
    }
    setLoading(false);
  };

  return (
    <>
      <Container style={{ paddingTop: "1rem" }} text>
        {success ? (
          <Message
            attached
            success
            size="large"
            header="Khôi phục mật khẩu hoàn tất"
            icon="check"
            content="Đăng nhập lại"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/login")}
          />
        ) : (
          <Message
            attached
            icon="settings"
            header="Khôi phục mật khẩu"
            color="teal"
          />
        )}

        {!success && (
          <Form
            loading={loading}
            onSubmit={resetPassword}
            error={errorMsg !== null}
          >
            <Message error header="Lỗi!" content={errorMsg} />

            <Segment>
              <Form.Input
                fluid
                icon="eye"
                type="password"
                iconPosition="left"
                label="Mật khẩu mới"
                placeholder="Nhập mật khẩu mới"
                name="field1"
                onChange={handleChange}
                value={field1}
                required
              />
              <Form.Input
                fluid
                icon="eye"
                type="password"
                iconPosition="left"
                label="Nhập lại mật khẩu mới"
                placeholder="Nhập lại mật khẩu mới"
                name="field2"
                onChange={handleChange}
                value={field2}
                required
              />

              <Divider hidden />

              <Button
                disabled={field1 === "" || field2 === "" || loading}
                icon="configure"
                type="submit"
                color="orange"
                content="Khôi phục"
              />
            </Segment>
          </Form>
        )}
      </Container>
    </>
  );
}

export default TokenScreen;
