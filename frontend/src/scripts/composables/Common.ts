import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useMessageDialog } from 'src/scripts/composables/Dialog';
import { DocumentError } from 'src/scripts/documents/DocumentError';
import { FirebaseError } from 'firebase/app';
import { useSessionStore } from 'stores/session-store';

/**
 * Provides common composables used across the application.
 *
 * Returns an object containing the following composables:
 * - `i18n`: Instance of the internationalization composable.
 * - `quasar`: Instance of the Quasar framework composable.
 * - `router`: Instance of the Vue Router composable.
 * - `session: Instance of the session.
 */
export function useCommonComposables() {
  return {
    i18n: useI18n(),
    quasar: useQuasar(),
    router: useRouter(),
    session: useSessionStore(),
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
 * Provides a utility function to execute asynchronous tasks with error handling,
 * loading state management, and optional callbacks for error and result handling.
 *
 * @return {Function} A function that takes an async task,
 * optional error callback, and optional result callback.
 * The returned function executes the task, showing a loading indicator,
 * and handles errors or results appropriately. Returns a boolean or a Promise
 * resolving to a boolean indicating task success or failure.
 */
export function useRunAsync(): <R>(
  task: () => Promise<R>,
  onError?: (error: unknown) => boolean,
  onResult?: (result: R) => void | Promise<void>,
) => Promise<R | undefined> {
  // Get the necessary composable functions
  const common = useCommonComposables();
  const messageDialog = useMessageDialog();
  // Return the function
  return async (task, onError, onResult) => {
    // Lock screen
    common.quasar.loading.show();
    try {
      // Run the asynchronous task
      const result = await task();
      // Call the result-handler function
      await onResult?.(result);
      // Return the result
      return result;
    } catch (error: unknown) {
      // Log the error in the console
      console.error(error);
      // Call the error-handler function and check if the error was processed by the handler
      if (!(onError?.(error) ?? false)) {
        // Get the detailed error message
        const details =
          error instanceof Error
            ? error.message
            : typeof error === 'string'
              ? error
              : 'Unknown error message.';
        // Show error dialog
        messageDialog(
          'error',
          common.i18n.t('dialog.unexpectedError.title'),
          common.i18n.t('dialog.unexpectedError.message'),
          details,
        );
      }
    } finally {
      // Unlock screen
      common.quasar.loading.hide();
    }
  };
}
