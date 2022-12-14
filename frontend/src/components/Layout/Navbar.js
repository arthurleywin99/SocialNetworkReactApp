import React from "react";
import { Menu, Container, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <Menu fluid borderless>
      <Container text>
        <Link to="/login" style={{ marginRight: "5px" }}>
          <Menu.Item header active={true}>
            <Icon size="large" name="sign in" />
            Đăng Nhập
          </Menu.Item>
        </Link>
        <Link to="/signup">
          <Menu.Item header active={true}>
            <Icon size="large" name="signup" />
            Đăng Ký
          </Menu.Item>
        </Link>
      </Container>
    </Menu>
  );
}
