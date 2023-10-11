const nameRegularExpression = /^[A-Za-z][A-Za-z'-]*$/; //This regular expression ensures that the name doesn't start with a number and only allows letters, hyphens, and single quotes in the rest of the name.

const phoneNumberRegularExpression = /^\+\d{2}-\d{10}$/; //This regular expression will ensure that the phone number starts with a plus sign, followed by two digits, a hyphen, and then ten digits, and nothing else is allowed before or after this pattern in the string.

export { nameRegularExpression, phoneNumberRegularExpression };
