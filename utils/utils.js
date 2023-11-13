const getUserValidationErrors = (error) => {
  let validationErrors = {};
  if (error.code === 11000) {
    validationErrors["email"] = "Email is already in use";
  } else if (
    error.name === "ValidationError" &&
    Object.keys(error.errors).length
  ) {
    const { first_name, last_name, email, phone_no, password } = error.errors;
    if (first_name) {
      validationErrors["firstName"] = first_name.message;
    }
    if (last_name) {
      validationErrors["lastName"] = last_name.message;
    }
    if (email) {
      validationErrors["email"] = email.message;
    }
    if (phone_no) {
      validationErrors["phoneNo"] = phone_no.message;
    }
    if (password) {
      validationErrors["password"] = password.message;
    }
  }

  return validationErrors;
};

const getBookValidationErrors = (error) => {
  let validationErrors = {};
  if (error.name === "ValidationError" && Object.keys(error.errors).length) {
    const { title, image, description } = error.errors;
    if (title) {
      validationErrors["title"] = title.message;
    }
    if (image) {
      validationErrors["image"] = image.message;
    }
    if (description) {
      validationErrors["description"] = description.message;
    }
  }

  return validationErrors;
};

const getWriterRoleValidationErrors = (error) => {
  let validationErrors = {};
  if (error.name === "ValidationError" && Object.keys(error.errors).length) {
    const { book_id, user_id, role } = error.errors;
    if (book_id) {
      validationErrors["book_id"] = book_id.message;
    }
    if (user_id) {
      validationErrors["user_id"] = user_id.message;
    }
    if (role) {
      validationErrors["role"] = role.message;
    }
  }

  return validationErrors;
};

const getSectionValidationErrors = (error) => {
  let validationErrors = {};
  if (error.name === "ValidationError" && Object.keys(error.errors).length) {
    const { book_id, title, content } = error.errors;
    if (book_id) {
      validationErrors["book_id"] = book_id.message;
    }
    if (title) {
      validationErrors["title"] = title.message;
    }
    if (content) {
      validationErrors["content"] = content.message;
    }
  }
  return validationErrors;
};

export {
  getUserValidationErrors,
  getBookValidationErrors,
  getWriterRoleValidationErrors,
  getSectionValidationErrors,
};
