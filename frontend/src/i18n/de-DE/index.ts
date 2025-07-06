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
    alteredByAt: 'geändert am {date} von {name}',
    createdByAt: 'erstell am {date} von {name}',
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
      maintainer: 'Betreuer',
      deployer: 'Bereitsteller',
      developer: 'Entwickler',
      visitor: 'Besucher',
    },
    customAttributeType: {
      string: 'Zeichenfolge',
      number: 'Zahl',
      boolean: 'Wahrheitswert',
    },
    provider: {
      aws: 'Amazon Web Services',
      gcp: 'Google Cloud Platform',
      snowflake: 'Snowflake Database',
    },
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
    dialog: {
      tab: {
        customAttributes: {
          message:
            'In der folgenden Übersicht sehen Sie die für dieses Artefakt erstellten benutzerdefinierten ' +
            'Attribute. Falls Sie die entsprechenden Berechtigungen haben, können Sie hier auch neue Attribute ' +
            'anlegen, bestehende Attribute bearbeiten oder auch Attribute entfernen.',
          emptyTableMessage: 'Bisher wurden noch keine benutzerdefinierten Attribute erstellt.',
          label: {
            key: 'Schlüssel',
            type: 'Datentyp',
            value: 'Wert',
          },
        },
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
      new: 'Neues Projekt erstellen',
      edit: 'Aktuelles Projekt bearbeiten',
      delete: 'Aktuelles Projekt löschen',
      view: 'Aktuelles Projekt ansehen',
      ownProjects: 'Eigene Projekte',
      memberships: 'Mitgliedschaften',
    },
    dialog: {
      create: {
        title: 'Neues Projekt',
        message:
          'In diesem Dialog können Sie ein neues Projekt anlegen. Bitte vergeben Sie einen Projektnamen und optional ' +
          'eine Beschreibung. Sie haben außerdem die Möglichkeit, Projektmitglieder hinzuzufügen und diesen ' +
          'entsprechende Rollen zuzuweisen, um die jeweiligen Zugriffsrechte festzulegen.',
      },
      update: {
        title: 'Projekt bearbeiten',
        message:
          'In diesem Dialog können Sie die Eigenschaften des Projekts bearbeiten als auch Projektteam verwalten, ' +
          'indem Sie Mitglieder hinzufügen oder entfernen oder die Rolle einzelner Mitglieder anpassen. Weiterhin ' +
          'haben Sie die Möglichkeit, die benutzerdefinierten Attribute des Projekts anzupassen.',
      },
      read: {
        title: 'Projekt ansehen',
        message:
          'Hier sehen Sie die Eigenschaften des Projekts sowie alle dem Projekt zugeordneten Mitarbeiter. Aufgrund ' +
          'Ihrer Rolle haben Sie jedoch keine Berechtigungen, Änderungen am Projekt vorzunehmen.',
      },
      delete: {
        title: 'Projekt löschen?',
        message:
          'Soll dieses Projekt "{name}" wirklich gelöscht werden. Alle Artefakte innerhalb des Projekte gehen ' +
          'unwiderruflich verloren. Diese Aktion kann nicht mehr rückgängig gemacht werden.',
      },
      tab: {
        members: {
          title: 'Projektmitglieder',
          message:
            'Hier können Sie Ihr Projektteam verwalten. Sie können hier einen expliziten Projektleiter festlegen,' +
            'der im Wesentlichen die gleichen Rechte hat wie Sie als Projekteigentümer mit der Ausnahme, dass er das ' +
            'Projekt nicht löschen darf. Weiterhin können Mitglieder Ihrem Projekt hinzufügen beziehungsweise diese ' +
            'wieder aus dem Projekt entfernen und jedem Mitglied eine bestimmte Rolle zuweisen.',
          messageMemberTable:
            'In der folgenden Tabelle können Sie Projektmitglieder hinzufügen oder entfernen und Ihnen entsprechende ' +
            'Rollen zuweisen. Die Rollen bestimmen die Berechtigungen, die die Mitglieder innerhalb dieser Projektes ' +
            'haben. Projekteigentümer und Projektmanager sind eigene Rollen. Diese können nicht zusätzlich auch als ' +
            'Projektmitglieder hinzugefügt werden.',
          emptyTable:
            'Aktuell sind diesem Projekt noch keine zusätzlichen Projektmitglieder zugeordnet.',
          name: 'Name des Mitglieds',
          role: 'Rolle im Projekt',
          active: 'Aktiv',
          description: 'Beschreibung (optional)',
        },
        customAttributes: {
          message:
            'In der folgenden Tabelle sehen Sie alle benutzerdefinierten Attribute für dieses Projekt. Falls Sie ' +
            'der Projekteigentümer sind, können Sie auch neue Attribute hinzufügen, bestehende Attribute ändern oder ' +
            'auch Attribute entfernen. Als Projektleiter können Sie den Inhalt der bestehenden Attribute ändern.',
        },
      },
    },
    error: {
      memberAlreadyAdded: 'Dieses Konto wurde bereits als Projektmitglied hinzugefügt.',
      isProjectOwner: 'Dieses Konto ist bereits Projekteigentümer.',
      isProjectManager: 'Dieses Konto ist bereits Projektmanager.',
    },
  },
  cloudServiceProvider: {
    menu: {
      new: 'Cloud-Dienstleister anbinden',
      edit: 'Bearbeiten',
      delete: 'Löschen',
      view: 'Anzeigen',
    },
    label: {
      name: 'Name des Cloud-Dienstleiters',
      provider: 'Cloud-Dienstleister',
      serviceAccount: 'Dienstkonto',
    },
    button: {
      testConnection: 'Verbindung testen',
    },
    dialog: {
      create: {
        title: 'Cloud-Dienst Provider erstellen',
        message:
          'Richten Sie hier eine Verbindung zu einem Cloud-Dienstleiter ein. Diese Verbindung kann später genutzt ' +
          'werden, um bestimmte Dienste wie zum Beispiel einen Dateispeicher wie Amazon S3 oder einen Datenbank wie ' +
          'Google BigQuery ansprechen zu können. Je nach Provider können Sie hier die entsprechenden Informationen ' +
          'für die Authentifizierung hinterlegen.',
      },
      update: {
        title: 'Cloud-Dienst Provider bearbeiten',
        message:
          'Hier können Sie die Eigenschaften des Cloud-Dienstleiters bearbeiten und testen, ob die Verbindung ' +
          'hergestellt werden kann. Es ist jedoch nicht mehr möglich, den Cloud-Dienstleiters selbst zu ändern.',
      },
      test: {
        success: {
          title: 'Verbindung erfolgreich',
          message: 'Die Verbindung zum Cloud-Dienstleister wurde erfolgreich hergestellt.',
        },
        error: {
          title: 'Verbindung fehlgeschlagen',
          message:
            'Leider konnte die Verbindung zum Cloud-Dienstleister nicht hergestellt werden. Genauere ' +
            'Informationen können Sie den Details entnehmen.',
        },
      },
      tab: {
        selection: {
          message:
            'Wählen Sie aus der Liste der aktuell unterstützten Cloud-Dienstleister den gewünschten Provider' +
            'aus. Je nach dem, welchen Cloud-Dienstleister Sie ausgewählt haben, müssen Sie die entsprechenden ' +
            'Anmeldeinformationen hinterlegen, um eine Verbindung herstellen zu können. Die Richtigkeit Ihrer ' +
            'Anmeldeinformationen können Sie mit einem Klick auf "Verbindung testen" prüfen.',
          messageGcp:
            'Um eine Verbindung mit Ihrem Projekt in Google Cloud Platform herzustellen, benötigt die ' +
            'Anwendung das Dienstkonto, mit welchem es sich authentifizieren kann. Dieses Dienstkonto muss alle ' +
            'notwendigen Rollen/Berechtigungen für den lesenden bzw. schreibenden Zugriff auf die Dienste Google ' +
            'Cloud Storage und BigQuery haben sowie dem Dienstkonto dieser Anwendung ({account}) Zugriff gewähren und ' +
            'die Rolle "Ersteller von Dienstkonto-Tokens" zuweisen.',
        },
      },
    },
  },
  cloudService: {
    menu: {
      new: 'Cloud-Dienst anbinden',
    },
  },
};
