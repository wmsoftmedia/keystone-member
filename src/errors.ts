const CODE_ACCOUNT_DISABLED = "11";
const CODE_INCORRECT_CREDS = "13";
const CODE_NOT_ACCEPTED = "15";

const CODE_MESSAGES = {
  [CODE_ACCOUNT_DISABLED]: "Your account is disabled.",
  [CODE_INCORRECT_CREDS]: "Incorrect username or password. Please try again.",
  [CODE_NOT_ACCEPTED]: "Your invitation has not been accepted.",
};

export const codeToMessage = (code: number) => {
  const c = String(code);
  switch (c) {
    case CODE_NOT_ACCEPTED:
    case CODE_INCORRECT_CREDS:
    case CODE_ACCOUNT_DISABLED:
      return CODE_MESSAGES[c];
    default:
      return "Unable to login. Please contact support.";
  }
};
