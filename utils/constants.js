const NAME_REGEX = /^[A-Za-z][A-Za-z0-9' -]*$/;
//This regular expression ensures that the name doesn't start with a number and only allows letters, hyphens, and single quotes in the rest of the name.

const PHONE_REGEX = /^\+\d{2}-\d{10}$/; //This regular expression will ensure that the phone number starts with a plus sign, followed by two digits, a hyphen, and then ten digits, and nothing else is allowed before or after this pattern in the string.

const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const PASSWORD_REGEX = /^.{8,}$/; //At least 8 characters

const STATUS_CODE = 200;

export { NAME_REGEX, PHONE_REGEX, EMAIL_REGEX, PASSWORD_REGEX, STATUS_CODE };
