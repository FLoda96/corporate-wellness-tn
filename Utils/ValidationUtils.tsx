interface ValidateEmailsArguments {
    email: string;
  }
  
  export function validateEmail({ email }: ValidateEmailsArguments): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  