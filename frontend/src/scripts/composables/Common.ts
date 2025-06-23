import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useMessageDialog } from 'src/scripts/composables/Dialog';

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
  onResult?: (result: unknown) => void,
) => void {
  const common = useCommonComposables();
  const messageDialog = useMessageDialog();
  return (task, onError, onResult) => {
    common.quasar.loading.show();
    task()
      .then((result) => {
        onResult?.(result);
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
          console.error(details);
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
