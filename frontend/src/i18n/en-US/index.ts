export default {
  application: {
    title: 'Cloud Data Modeling Tool',
    copyright: '&copy Copyright 2025 Dirk Michael',
    version: 'Version {major}.{minor}.{patch} ({build})',
  },

  button: {
    back: 'Back',
    cancel: 'Cancel',
    close: 'Close',
    ok: 'Okay',
  },

  label: {
    email: 'Email Address',
    details: 'Details',
    firstname: 'First Name',
    lastname: 'Last Name',
    password: 'Password',
    passwordConfirm: 'Confirm Password',
  },

  message: {
    noSelection: 'No selection',
    mandatory: 'This input field must not be empty.',
  },

  dialog: {
    unexpectedError: {
      title: 'Unexpected Error',
      message:
        'An unexpected error has occurred. This should not have happened. Please contact your ' +
        'administrator with detailed error information.',
    },
  },

  options: {
    language: {
      enUS: 'English (US)',
      deDE: 'German (DE)',
    },
  },

  main: {
    account: {
      menu: {
        darkMode: 'Dark Mode',
        lightMode: 'Light Mode',
        language: 'Language',
        logout: 'Sign Out',
      },
    },
  },

  authentication: {
    button: {
      login: 'Sign In',
      loginGoogle: 'Sign in with Google',
      register: 'Register Account',
      registerGoogle: 'Sign up with Google',
      resetPassword: 'Reset Password',
    },
    message: {
      login:
        'Please log in with your email and password, or use your Google account for quick access. ' +
        "If you don't have an account yet, you can create a new one by clicking the 'Register Account' " +
        'link below. Your account will need to be approved by an administrator before you can log ' +
        'in.',
      register:
        'Please enter your name, your email address, and the password for your new account. Alternatively, ' +
        'you can register with your Google account. However, after successful registration, an ' +
        'administrator must approve your account before you can log in.',
      reset:
        'If you want to reset your password, please enter your email address. You will then receive ' +
        'an email with a link to a webpage where you can create a new password.',
    },
    dialog: {
      login: {
        aborted: {
          title: 'Login Aborted',
          message: 'You have aborted the login process. Please try again.',
        },
        unknown: {
          title: 'Unknown Email Address',
          message:
            'No account was found for this email address. You must first register with this email address ' +
            'and have it activated before you can log in.',
        },
      },
      register: {
        success: {
          title: 'Registration Successful',
          message:
            'Your account has been successfully registered. However, please note that you can only log in ' +
            'after an administrator has approved your account.',
        },
        exists: {
          title: 'Account already exists',
          message:
            'This account already exists. If it has already been activated, you can log in using the ' +
            'corresponding provider (e.g., Google).',
        },
        aborted: {
          title: 'Registration Aborted',
          message:
            'You have aborted the registration process. Your account was not created. Please try again.',
        },
      },
      reset: {
        success: {
          title: 'Request sent successfully',
          message:
            'If there is an account associated with this email address, an email with a link to reset ' +
            'the password has been sent to this address. Please also check your spam folder if necessary.',
        },
      },
    },
    error: {
      passwordConfirmationFailed: 'The password confirmation failed.',
      invalidEmail: 'The email address is invalid.',
      invalidPassword: 'The password does not match the requirements.',
      emailAlreadyInUse: 'This email address is already in use.',
      invalidCredentials: 'The provided credentials are invalid.',
      accountLocked: 'Your account is currently not active.',
      tooManyRequests: 'Too many failed attempts. Please wait a few minutes before trying again.',
    },
  },
};
