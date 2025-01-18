import { useFormContext } from 'react-hook-form';

export const useFormNamespace = (namespace?: string) => {
	const formContext = useFormContext();
	const { getValues, setValue, watch } = formContext;

	// Function to construct the full key name with optional namespace.
	const getNameKey = (key: string): string => {
		return `${namespace ? `${namespace}.` : ''}${key}`;
	};

	// Generic function to get a value with a custom type.
	// T specifies the expected return type of the function.
	const getValue = <T = never>(key: string): T | undefined => {
		const namespaceKey = getNameKey(key);
		// Split the key by '.' to navigate through nested objects.
		const keys = namespaceKey.split('.');
		let result = getValues();
		for (const key of keys) {
			if (result[key] === undefined) {
				return undefined;
			}
			result = result[key];
		}
		return result as T;
	};

	// Generic function to set a value with a custom type.
	// T is used here to enforce the type of value parameter.
	const setValueWithNamespace = <T = never>(key: string, value: T) => {
		setValue(getNameKey(key), value);
	};

	const watchNamespace = (key: string) => {
		watch(getNameKey(key));
	};

	return { getNameKey, getValue, setValueWithNamespace, watchNamespace };
};
