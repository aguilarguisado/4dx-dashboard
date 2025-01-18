export function removeKeys(obj: Record<string, unknown>, keys: string[]): Record<string, unknown> {
	return keys.reduce((result, key) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { [key]: omitted, ...rest } = result;
		return rest;
	}, obj);
}
