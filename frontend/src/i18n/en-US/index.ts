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
    create: 'Create',
    ok: 'Okay',
    save: 'Save',
  },

  label: {
    email: 'Email Address',
    customAttributes: 'Custom Attributes',
    details: 'Details',
    description: 'Description (optional)',
    firstname: 'First Name',
    lastname: 'Last Name',
    password: 'Password',
    passwordConfirm: 'Confirm Password',
  },

  message: {
    alteredByAt: 'altered at {date} by {name}',
    createdByAt: 'created at {date} by {name}',
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
    projectRole: {
      owner: 'Project Owner',
      manager: 'Project Manager',
      maintainer: 'Maintainer',
      deployer: 'Deployer',
      developer: 'Developer',
      visitor: 'Visitor',
    },
    customAttributeType: {
      string: 'String',
      number: 'Number',
      boolean: 'Boolean',
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
    dialog: {
      tab: {
        customAttributes: {
          message:
            'In the following overview, you can see the custom attributes created for this artifact. ' +
            'If you have the appropriate permissions, you can also create new attributes here, edit existing ' +
            'attributes, or remove attributes.',
          emptyTableMessage: 'No custom attributes have been created yet.',
          label: {
            key: 'Key',
            type: 'Datatype',
            value: 'Value',
          },
        },
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
      selection: {
        title: 'Select Account',
        message:
          'Enter the email address of the account you want to select here. Please note that this ' +
          'account must already be registered for it to be selectable.',
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
      unknownEmail: 'This email address is unknown or invalid.',
    },
  },

  project: {
    label: {
      active: 'Active Project',
      name: 'Project Name',
    },
    menu: {
      new: 'Create New Project',
      edit: 'Edit Current Project',
      delete: 'Delete Current Project',
      view: 'View Current Project',
      ownProjects: 'Own Projects',
      memberships: 'Memberships',
    },
    dialog: {
      create: {
        title: 'New Project',
        message:
          'In this dialog, you can create a new project. Please provide a project name and optionally a ' +
          'description. You also have the option to add project members and assign them corresponding roles ' +
          'to define the respective access rights.',
      },
      update: {
        title: 'Edit Project',
        message:
          'In this dialog, you can edit the properties of the project as well as manage the project team, ' +
          'by adding or removing members or adjusting the role of individual members. Furthermore, you have the option ' +
          "to customize the project's custom attributes.",
      },
      read: {
        title: 'View Project',
        message:
          'Here you can see the properties of the project and all employees assigned to the project. However, due to ' +
          'your role, you do not have permissions to make changes to the project.'
      },
      delete: {
        title: 'Delete Project?',
        message:
          'Do you really want to delete this project "{name}"? All artifacts within the project will be ' +
          'irretrievably lost. This action cannot be undone.',
      },
      tab: {
        members: {
          title: 'Project Members',
          message:
            'Here you can manage your project team. You can explicitly assign a project manager here, ' +
            'who essentially has the same rights as you as the project owner, with the exception that they ' +
            'cannot delete the project. Furthermore, you can add or remove members to your project and assign ' +
            'a specific role to each member.',
          messageMemberTable:
            'In the following table, you can add or remove project members and assign them corresponding roles. ' +
            'The roles determine the permissions that the members have within this project. Project owners and project ' +
            'managers are separate roles. These cannot also be added additionally as project members.',
          emptyTable:
            'Currently, no additional project members have been assigned to this project.',
          name: 'Member Name',
          role: 'Project Role',
          active: 'Active',
          description: 'Description (optional)',
        },
        customAttributes: {
          message:
            'In the following table, you can see all custom attributes for this project. If you are ' +
            'the project owner, you can also add new attributes, modify existing attributes, or ' +
            'remove attributes. As a project owner,',
        },
      },
    },
    error: {
      memberAlreadyAdded: 'This account has already been added as a project member.',
      isProjectOwner: 'This account is already the project owner.',
      isProjectManager: 'This account is already the project manager.',
    },
  },
};
