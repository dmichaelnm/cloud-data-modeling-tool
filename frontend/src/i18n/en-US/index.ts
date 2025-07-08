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
    copyToClipboard: 'Copy To Clipboard',
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
    provider: {
      aws: 'Amazon Web Services',
      gcp: 'Google Cloud Platform',
      snowflake: 'Snowflake Database',
    },
    aws: {
      region: {
        usEast1: 'US East (N. Virginia)',
        usEast2: 'US East (Ohio)',
        usWest1: 'US West (N. California)',
        usWest2: 'US West (Oregon)',
        afSouth1: 'Africa (Cape Town)',
        apEast1: 'Asia Pacific (Hong Kong)',
        apSouth1: 'Asia Pacific (Mumbai)',
        apSouth2: 'Asia Pacific (Hyderabad)',
        apNortheast1: 'Asia Pacific (Tokyo)',
        apNortheast2: 'Asia Pacific (Seoul)',
        apNortheast3: 'Asia Pacific (Osaka)',
        apSoutheast1: 'Asia Pacific (Singapore)',
        apSoutheast2: 'Asia Pacific (Sydney)',
        apSoutheast3: 'Asia Pacific (Jakarta)',
        caCentral1: 'Canada (Central)',
        cnNorth1: 'China (Beijing)',
        cnNorthwest1: 'China (Ningxia)',
        euCentral1: 'Europe (Frankfurt)',
        euCentral2: 'Europe (Zurich)',
        euNorth1: 'Europe (Stockholm)',
        euWest1: 'Europe (Ireland)',
        euWest2: 'Europe (London)',
        euWest3: 'Europe (Paris)',
        euSouth1: 'Europe (Milan)',
        euSouth2: 'Europe (Zaragoza)',
        meSouth1: 'Middle East (Bahrain)',
        meCentral1: 'Middle East (UAE)',
        saEast1: 'South America (São Paulo)',
        usGovEast1: 'AWS GovCloud (US-East)',
        usGovWest1: 'AWS GovCloud (US-West)',
      },
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
          'your role, you do not have permissions to make changes to the project.',
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
  cloudServiceProvider: {
    menu: {
      new: 'Connect To Cloud-Service Provider',
      edit: 'Edit',
      delete: 'Delete',
      view: 'View',
    },
    label: {
      name: 'Cloud Service Provider Name',
      provider: 'Cloud Service Provider',
      serviceAccount: 'Service Account',
      iamRoleARN: 'IAM Role ARN',
      account: 'Account',
      username: 'Username',
    },
    button: {
      testConnection: 'Test Connection',
    },
    dialog: {
      create: {
        title: 'Create Cloud Service Provider',
        message:
          'Set up a connection to a cloud service provider here. This connection can be later used to access certain ' +
          'services, such as a file storage like Amazon S3 or a database like Google BigQuery. Depending on the ' +
          'provider, you can enter the appropriate information for authentication here.',
      },
      update: {
        title: 'Edit Cloud Service Provider',
        message:
          'Here you can edit the properties of the cloud service provider and test whether the connection can be established. ' +
          'However, it is no longer possible to change the cloud service provider itself.',
      },
      read: {
        title: 'Show Cloud Provider',
        message:
          'Here you can see the properties of the connected cloud provider. However, due to your role in this ' +
          'project you cannot make any changes.'
      },
      test: {
        success: {
          title: 'Connection successful',
          message:
            'The connection to the cloud service provider has been successfully established.',
        },
        error: {
          title: 'Connection failed',
          message:
            'Unfortunately, the connection to the cloud service provider could not be established. More ' +
            'detailed information can be found in the details.',
        },
      },
      delete: {
        title: 'Delete Cloud Service Provider?',
        message:
          'Are you sure you want to delete the Cloud Service Provider "{name}"? All dependent ' +
          'artifacts, such as subordinate cloud services, will also be lost. This action cannot ' +
          'be undone.',
      },
      tab: {
        selection: {
          message:
            'Select the desired provider from the list of currently supported cloud service providers.' +
            ' Depending on the cloud service provider you have selected, you must provide the relevant ' +
            'credentials to establish a connection. You can verify the correctness of your ' +
            'credentials by clicking on "Test Connection".',
          messageGcp:
            'To connect to your project in Google Cloud Platform, the application needs the service account it ' +
            'can authenticate with. This service account must have all necessary roles/permissions for read and write access ' +
            "to the Google Cloud Storage and BigQuery services, grant access to this application's service account " +
            'and assign the role "Service Account Token Creator".',
          messageGcpAccountInfo:
            'The following information can be used to create a corresponding service account in your own Google Cloud ' +
            'Platform project for accessing the services used by this application.',
          messageAws:
            'To connect to your AWS account, the application needs the ARN ' +
            '(Amazon Resource Name) of the role with which it can authenticate. This role must have all ' +
            'necessary roles/permissions for read and write access to Amazon S3 ' +
            "and Athena services, and grant access to the application's AWS account.",
          messageAwsAccountInfo:
            'The following information can be used to create the appropriate role in your own AWS account ' +
            'to allow access to services by this application.',
          messageSnowflake:
            'To connect to your Snowflake database, you need to specify your Snowflake account here ' +
            'and the database user to log in with. The database user must be ' +
            'associated with the public key to allow external access.',
          messageSnowflakeAccountInfo:
            'Here you can see the public key. You can copy it and assign this ' +
            'key to the above-mentioned database user in your Snowflake console.',
        },
      },
    },
  },
  cloudService: {
    menu: {
      new: 'Connect To Cloud Service',
    },
  },
};
