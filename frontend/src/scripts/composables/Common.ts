import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useMessageDialog } from 'src/scripts/composables/Dialog';
import { DocumentError } from 'src/scripts/documents/DocumentError';
import { FirebaseError } from 'firebase/app';

/**
 * Provides common composables used across the application.
 *
 * Returns an object containing the following composables:
 * - `i18n`: Instance of the internationalization composable.
 * - `quasar`: Instance of the Quasar framework composable.
 * - `router`: Instance of the Vue Router composable.
 */
export function useCommonComposables() {
  return {
    i18n: useI18n(),
    quasar: useQuasar(),
    router: useRouter(),
  };
}

/**
 * A custom hook that returns a function to determine the error code from an unknown error object.
 * It checks if the error is an instance of `DocumentError` or `FirebaseError` and retrieves the
 * associated error code.
 *
 * @return {function(error: unknown): (string | undefined)} A function that takes an error object as input and
 * returns the corresponding error code if the error is of a recognized type, or undefined otherwise.
 */
export function useDetermineErrorCode(): (error: unknown) => string | undefined {
  return (error) => {
    if (error instanceof DocumentError) {
      return error.code;
    } else if (error instanceof FirebaseError) {
      return error.code;
    }
    return undefined;
  };
}

/**
 * Provides a utility function to handle asynchronous tasks with error and result handling,
 * while managing loading states and displaying error dialogs for unhandled errors.
 *
 * @return {function} A function that accepts an asynchronous task, an error handler,
 * and a result handler. The task is executed with loading state management. Any unhandled
 * errors are processed and displayed in an error dialog, if applicable.
 */
export function useRunAsync(): (
  task: () => Promise<unknown>,
  onError?: (error: unknown) => boolean,
  onResult?: (result: unknown) => void | Promise<void>,
) => void {
  const common = useCommonComposables();
  const messageDialog = useMessageDialog();
  return (task, onError, onResult) => {
    common.quasar.loading.show();
    task()
      .then(async (result) => {
        await onResult?.(result);
      })
      .catch((error) => {
        console.error(error);
        if (!(onError?.(error) ?? false)) {
          // Get the detailed error message
          const details =
            error instanceof Error
              ? error.message
              : typeof error === 'string'
                ? error
                : (error.toString() as string);
          // Show error dialog
          messageDialog(
            'error',
            common.i18n.t('dialog.unexpectedError.title'),
            common.i18n.t('dialog.unexpectedError.message'),
            details,
          );
        }
      })
      .finally(() => {
        common.quasar.loading.hide();
      });
  };
}
