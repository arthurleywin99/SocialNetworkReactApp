import React from "react";
import { Message } from "semantic-ui-react";

export default function HeaderMessage() {
  const path = window.location.pathname;
  const signupRoute = path === "/signup";

  return (
    <Message
      color="teal"
      attached
      header={signupRoute ? "Bắt Đầu" : "Chào Mừng Trở Lại"}
      icon={signupRoute ? "settings" : "privacy"}
      content={signupRoute ? "Tạo Tài Khoản" : "Đăng Nhập Với Email & Mật Khẩu"}
    />
  );
}
