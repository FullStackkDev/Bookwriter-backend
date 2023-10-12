const nameRegex = /^[A-Za-z][A-Za-z0-9' -]*$/;
//This regular expression ensures that the name doesn't start with a number and only allows letters, hyphens, and single quotes in the rest of the name.

const phoneRegex = /^\+\d{2}-\d{10}$/; //This regular expression will ensure that the phone number starts with a plus sign, followed by two digits, a hyphen, and then ten digits, and nothing else is allowed before or after this pattern in the string.

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const passwordRegex = /^.{8,}$/; //At least 8 characters

const getUserValidationErrors = (error) => {
  let ValidationErrors = {};
  const { first_name, last_name, email, phone_no, password } = error.errors;
  if (first_name) {
    ValidationErrors["firstName"] = first_name.message;
  }
  if (last_name) {
    ValidationErrors["lastName"] = last_name.message;
  }
  if (email) {
    ValidationErrors["email"] = email.message;
  }
  if (phone_no) {
    ValidationErrors["phoneNo"] = phone_no.message;
  }
  if (password) {
    ValidationErrors["password"] = password.message;
  }
  return ValidationErrors;
};
export {
  nameRegex,
  phoneRegex,
  emailRegex,
  passwordRegex,
  getUserValidationErrors,
};
