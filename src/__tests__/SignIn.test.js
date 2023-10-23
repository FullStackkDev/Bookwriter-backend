import { render, screen } from "@testing-library/react";
import { validateForm } from "../utils/utils";
import { PASSWORD_LENGTH, REQUIRED } from "../utils/messages";
import { validationRules } from "../screens/signIn/validator/rules";
import SignIn from "../screens/signIn/design";
import { BrowserRouter } from "react-router-dom";
import store from "../Redux/store";
import { Provider } from "react-redux";

test("Render", () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    </Provider>
  );
  expect(screen.getByTestId("heading")).toHaveTextContent(/Book Writer/);
  expect(screen.getByTestId("title")).toHaveTextContent(/Sign In/);

  const inputEmail = screen.getByTestId("email");
  expect(inputEmail).toBeInTheDocument();

  const inputPassword = screen.getByTestId("password");
  expect(inputPassword).toBeInTheDocument();

  expect(screen.getByTestId("button")).toHaveTextContent(/Sign In/);
});

test("Empty inputs test", () => {
  expect(
    validateForm({ email: "", password: "" }, validationRules)
  ).toStrictEqual({
    email: "E-mail " + REQUIRED,
    password: "Password " + REQUIRED,
  });
});

test("Invalid inputs tests 1", () => {
  expect(
    validateForm({ email: "talha786", password: "" }, validationRules)
  ).toStrictEqual({
    email: "Invalid E-mail address.",
    password: "Password " + REQUIRED,
  });
});

test("Invalid inputs tests 2", () => {
  expect(
    validateForm({ email: "talha786", password: "123456" }, validationRules)
  ).toStrictEqual({
    email: "Invalid E-mail address.",
    password: "Password " + PASSWORD_LENGTH,
  });
});

test("Correct SignIn inputs", () => {
  expect(
    validateForm(
      { email: "talha786.156@gmail.com", password: "12345678" },
      validationRules
    )
  ).toStrictEqual({});
});
