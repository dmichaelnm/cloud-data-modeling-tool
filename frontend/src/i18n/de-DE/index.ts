export default {
  application: {
    title: 'Cloud Data Modeling Tool',
    copyright: '&copy Copyright 2025 Dirk Michael',
    version: 'Version {major}.{minor}.{patch} ({build})',
  },

  button: {
    back: 'Zurück',
    cancel: 'Abbrechen',
    close: 'Schließen',
    create: 'Erstellen',
    ok: 'Okay',
    save: 'Speichern',
  },

  label: {
    email: 'Email-Adresse',
    customAttributes: 'Benutzerdefinierte Attribute',
    details: 'Details',
    description: 'Beschreibung (optional)',
    firstname: 'Vorname',
    lastname: 'Nachname',
    password: 'Kennwort',
    passwordConfirm: 'Kennwort bestätigen',
  },

  message: {
    noSelection: 'Keine Auswahl',
    mandatory: 'Dieses Eingabefeld darf nicht leer sein.',
  },

  dialog: {
    unexpectedError: {
      title: 'Unerwarteter Fehler',
      message:
        'Ein unerwarteter Fehler ist aufgetreten. Dies hätte nicht passieren dürfen. Bitte wenden Sie sich mit ' +
        'detailierten Fehlermeldung an Ihren Administrator.',
    },
  },

  options: {
    language: {
      enUS: 'Englisch (US)',
      deDE: 'Deutsch (DE)',
    },
    projectRole: {
      owner: 'Projekteigentümer',
      manager: 'Projektleiter',
    }
  },

  main: {
    account: {
      menu: {
        darkMode: 'Dunkler Modus',
        lightMode: 'Heller Modus',
        language: 'Sprache',
        logout: 'Abmelden',
      },
    },
  },

  authentication: {
    button: {
      login: 'Anmelden',
      loginGoogle: 'Über Google anmelden',
      register: 'Konto erstellen',
      registerGoogle: 'Über Google registrieren',
      resetPassword: 'Kennwort zurücksetzen',
    },
    message: {
      login:
        'Bitte melden Sie sich mit Ihrer E-Mail-Adresse und Ihrem Kennwort an oder nutzen Sie Ihr Google-Konto für ' +
        'einen schnellen Zugang. Wenn Sie noch kein Konto haben, können Sie ein neues erstellen, indem Sie unten auf ' +
        'den Link "Konto erstellen" klicken. Ihr Konto muss von einem Administrator genehmigt werden, bevor Sie sich ' +
        'anmelden können.',
      register:
        'Bitte geben Sie Ihren Namen, ihre Email-Adresse und das Kennwort für Ihr neues Konto ein. Alternativ ' +
        'können Sie sich mit Ihrem Google-Konto registrieren. Nach erfolgreicher Registrierung muss jedoch noch ein ' +
        'Administrator Ihr Konto freischalten, damit Sie sich anmelden können.',
      reset:
        'Wenn Sie Ihr Kennwort zurücksetzen möchten, geben Sie bitte Ihre Email-Adresse ein. Sie erhalten dann ' +
        'Email mit einem Link zu einer Webseite, auf der Sie ein neues Kennwort vergeben können.',
    },
    dialog: {
      login: {
        aborted: {
          title: 'Anmeldung abgebrochen',
          message: 'Sie haben den Anmeldeprozess abgebrochen. Bitte versuchen Sie es erneut.',
        },
        unknown: {
          title: 'Unbekannte Email-Adresse',
          message:
            'Für diese Email-Adresse wurde kein Konto gefunden. Sie müssen sich erst mit dieser Email-Adresse ' +
            'registrieren und sich freischalten lassen, bevor Sie sich anmelden können.',
        },
      },
      register: {
        success: {
          title: 'Registrierung erfolgreich',
          message:
            'Ihr Konto wurde erfolgreich registriert. Beachten Sie jedoch, dass Sie sich erst anmelden können, ' +
            'wenn ein Administrator Ihr Konto freigeschaltet hat.',
        },
        exists: {
          title: 'Konto existiert bereits',
          message:
            'Dieses Konto existiert bereits. Sofern es bereits freigeschaltet ist, können Sie sich über den ' +
            'entsprechenden Provider (z.B. Google) anmelden.',
        },
        aborted: {
          title: 'Registrierung abgebrochen',
          message:
            'Sie haben den Registrierungsprozess abgebrochen. Ihr Konto wurde nicht erstellt. Bitte versuchen ' +
            'Sie es erneut.',
        },
      },
      reset: {
        success: {
          title: 'Anfrage erfolgreich versendet',
          message:
            'Sofern es ein Konto mit dieser Email-Adresse gibt, wurde eine Email mit einem Link zum ' +
            'Zurücksetzen des Kennworts an diese Adresse gesendet. Bitte prüfen Sie gegebenenfalls auch Ihren ' +
            'Spam-Ordner.',
        },
      },
      selection: {
        title: 'Konto auswählen',
        message:
          'Geben Sie hier die Email-Adresse des Kontos an, welches Sie auswählen möchten. Beachten Sie, dass ' +
          'dieses Konto bereits registriert sein muss, um es auswählen zu können.',
      },
    },
    error: {
      passwordConfirmationFailed: 'Die Kennwortbestätigung ist fehlgeschlagen.',
      invalidEmail: 'Die Email-Adresse ist ungültig.',
      invalidPassword: 'Das Kennwort entspricht nicht den Anforderungen.',
      emailAlreadyInUse: 'Diese Email-Adresse wird bereits verwendet.',
      invalidCredentials: 'Die Anmeldeinformationen sind nicht korrekt.',
      accountLocked: 'Ihr Konto ist aktuell nicht aktiv.',
      tooManyRequests: 'Zuviele fehlgeschlagene Versuche. Warten Sie einige Minuten.',
      unknownEmail: 'Diese Email-Adresse ist unbekannt oder ungültig.',
    },
  },

  project: {
    label: {
      active: 'Aktives Projekt',
      name: 'Name des Projekts',
    },
    menu: {
      new: 'Neues Projekt',
    },
    dialog: {
      create: {
        title: 'Neues Projekt',
        message:
          'In diesem Dialog können Sie ein neues Projekt anlegen. Bitte vergeben Sie einen Projektnamen und optional ' +
          'eine Beschreibung. Sie haben außerdem die Möglichkeit, Projektmitglieder hinzuzufügen und diesen ' +
          'entsprechende Rollen zuzuweisen, um die jeweiligen Zugriffsrechte festzulegen.',
      },
      tab: {
        members: {
          title: 'Projektmitglieder',
          message:
            'Hier können Sie Ihr Projektteam verwalten. Sie können hier einen expliziten Projektleiter festlegen,' +
            'der im Wesentlichen die gleichen Rechte hat wie Sie als Projekteigentümer mit der Ausnahme, dass er das ' +
            'Projekt nicht löschen darf. Weiterhin können Mitglieder Ihrem Projekt hinzufügen beziehungsweise diese ' +
            'wieder aus dem Projekt entfernen und jedem Mitglied eine bestimmte Rolle zuweisen.',
        },
      },
    },
  },
};
