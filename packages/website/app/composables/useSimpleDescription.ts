import { simpleDescriptionFormatting } from '@lolcalc/core/misc';

export function useSimpleDescription(description: string, addAlt = true) {
	const rv = ref('loading...');

	simpleDescriptionFormatting(description, addAlt).then(value => rv.value = value);

	return rv;
}
