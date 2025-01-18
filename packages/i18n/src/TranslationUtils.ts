import { IntlMessageKeys, IntlObject } from './types';

export const buildZodI18N = (id: IntlMessageKeys, values?: Record<string, unknown>): string => {
  return JSON.stringify({ id, values });
};

export const parseZodMessageError: (message?: string) => IntlObject | undefined = (message?: string) => {
  if (!message) return;
  // TODO: Ñapa alert: This is an ugly fix before I figure out how to override all required errors for zod
  if (message.toLowerCase() == 'required') {
    return { id: 'validation.error.required' };
  }
  try {
    return JSON.parse(message);
  } catch {
    return { id: message };
  }
};
