import React from "react";
import { Message, Icon, Divider } from "semantic-ui-react";
import { Link } from "react-router-dom";

export default function FooterMessage() {
  const path = window.location.pathname;
  const signupRoute = path === "/signup";

  return (
    <>
      {signupRoute ? (
        <>
          <Message attached="bottom" warning>
            <Icon name="help" />
            Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
          </Message>
          <Divider hidden />
        </>
      ) : (
        <>
          <Message attached="bottom" info>
            <Icon name="lock" />
            <Link to="/reset">Quên mật khẩu?</Link>
          </Message>

          <Message attached="bottom" warning>
            <Icon name="help" />
            Người dùng mới? <Link to="/signup">Đăng ký </Link> ngay
          </Message>
        </>
      )}
    </>
  );
}
