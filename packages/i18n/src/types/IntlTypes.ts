/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/no-namespace */
import { messages } from '../locales/en-US';

declare global {
    namespace FormatjsIntl {
      interface Message {
        ids: keyof typeof messages
      }
    }
  }

export type IntlObject = {
    id: IntlMessageKeys,
    values?: IntlValues,
}
export type IntlMessageKeys = keyof typeof messages;
export type IntlValues = Record<string, string | number | boolean | Date>;
