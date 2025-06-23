import { ref } from 'vue';
import { useCommonComposables } from 'src/scripts/composables/Common';

/**
 * Represents the definition of a dialog button with customizable properties.
 */
export type TDialogButton = {
  value: string;
  label: string;
  color?: string | undefined;
  appearance?: 'push' | 'link' | undefined;
};

/**
 * Represents the type of a message dialog. This type is used to define
 * the category or purpose of the message dialog.
 *
 * Available options:
 * - 'info': General information messages.
 * - 'warning': Cautionary messages to grab attention.
 * - 'error': Messages indicating errors or critical issues.
 * - 'success': Notifications for successful operations.
 * - 'question': Messages that prompt the user for input or decision.
 */
export type TMessageDialogType = 'info' | 'warning' | 'error' | 'success' | 'question';

/**
 * Represents the options for configuring a message dialog.
 *
 * This type defines the structure of options that can be passed to customize
 * the appearance and behavior of a message dialog component.
 *
 * Properties:
 * - `type` (TMessageDialogType): The type of message dialog, which determines
 *   its visual style and purpose (e.g., info, warning, error).
 * - `title` (string): The title of the message dialog, typically displayed
 *   prominently at the top of the dialog.
 * - `message` (string): The main content or message presented in the dialog.
 * - `details` (string | undefined): Optional additional details or descriptions
 *   to provide more context about the dialog's message.
 * - `buttons` (TDialogButton[] | undefined): An optional array of dialog buttons
 *   that the user can interact with.
 * - `closeHandler` ((value: string) => void | undefined): An optional callback function
 *   triggered when the dialog is closed. The parameter `value` represents the button that was
 *   clicked.
 * - `visibility` (boolean): A boolean flag indicating whether the dialog is
 *   currently visible.
 */
export type TMessageDialogOptions = {
  type: TMessageDialogType;
  title: string;
  message: string;
  details: string | undefined;
  buttons: TDialogButton[] | undefined;
  closeHandler: ((value: string) => void | Promise<void>) | undefined;
  visibility: boolean;
};

/**
 * Reactive reference object that defines configuration options for a message dialog.
 */
export const messageDialogOptions = ref<TMessageDialogOptions>({
  title: '',
  message: '',
  details: '',
  buttons: undefined,
  type: 'info',
  closeHandler: undefined,
  visibility: false,
});

/**
 * Provides a function to display a message dialog with specified parameters.
 *
 * @return {function} A function that takes the following parameters:
 * - type: The type of the dialog, indicating its purpose or severity.
 * - title: The title text displayed in the dialog.
 * - message: The main message or content of the dialog.
 * - details: Optional. Additional details or descriptions to display in the dialog.
 * - closeHandler: Optional. A callback function that is called after the dialog is closed.
 */
export function useMessageDialog(): (
  type: TMessageDialogType,
  title: string,
  message: string,
  details?: string,
  closeHandler?: (value: string) => (void | Promise<void>),
) => void {
  return (type, title, message, details, closeHandler) => {
    messageDialogOptions.value = {
      type: type,
      title: title,
      message: message,
      details: details,
      buttons: undefined,
      closeHandler: closeHandler,
      visibility: true,
    };
  };
}

/**
 * Provides a reusable confirmation dialog function that displays a message dialog with
 * customizable title, message, details, and buttons.
 *
 * @return {Function} A function that opens a confirmation dialog. The function accepts the following
 * parameters:
 * - title: The title of the confirmation dialog.
 * - message: The main message of the confirmation dialog.
 * - details: Optional additional details for the dialog.
 * - closeHandler: Optional callback function that is invoked with the selected value
 *   ('ok' or 'cancel') when the dialog closes.
 */
export function useConfirmationDialog(): (
  title: string,
  message: string,
  details?: string,
  closeHandler?: (value: string) => void,
) => void {
  const common = useCommonComposables();
  return (title, message, details, closeHandler) => {
    messageDialogOptions.value = {
      type: 'question',
      title: title,
      message: message,
      details: details,
      buttons: [
        { value: 'ok', label: common.i18n.t('button.ok'), appearance: 'push' },
        { value: 'cancel', label: common.i18n.t('button.cancel'), appearance: 'link' },
      ],
      closeHandler: closeHandler,
      visibility: true,
    };
  };
}
