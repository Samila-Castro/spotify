import { Button, Form } from "rsuite";
import style from "./Login.module.css";

function Login() {
  return (
    <div className={style["wrapper-form"]}>
      <Form>
        <Form.Group controlId="name">
          <Form.ControlLabel className={style.label}>
            Username
          </Form.ControlLabel>
          <Form.Control name="name" />
          <Form.HelpText className={style.helperText}>
            Username is required
          </Form.HelpText>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.ControlLabel className={style.label}>
            Password
          </Form.ControlLabel>
          <Form.Control name="password" type="password" autoComplete="off" />
        </Form.Group>

        <div className={style.buttonBox}>
          <Button appearance="default">Login</Button>
        </div>
      </Form>
    </div>
  );
}

export default Login;
