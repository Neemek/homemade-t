import { readFileSync } from "fs";

interface TOptions {
	onlySingleSpaces?: boolean;
}

interface TFunction {
	(key: string, keymap?: object, options?: TOptions): string;
}

interface LocaleSetter {
	(key);
}

class makeT {
	fromJSON(data: object): [TFunction, LocaleSetter] | undefined {
		const lookup = new Map<string, Map<string, string>>();

		let locales = [];
		try {
			locales = Object.keys(data);
			if (locales.length === 0) throw new Error("Empty JSON object.");

			for (let locale of locales) {
				const localization = new Map<string, string>();
				const localizationData = data[locale];
				for (let valueKey of Object.keys(localizationData)) {
					localization.set(valueKey, localizationData[valueKey]);
				}

				lookup.set(locale, localization);
			}
		} catch {
			return undefined;
		}
		let locale = locales.includes("en") ? "en" : locales.at(0);

		return [
			(
				key: string,
				keymap: object = {},
				options: TOptions = { onlySingleSpaces: true }
			): string => {
				let value = this.replaceWithKeys(lookup.get(locale)?.get(key), keymap);
				if (value === undefined) return key;

				if (options.onlySingleSpaces) return value?.replace(/ {2,}/g, " ");
				else return value;
			},
			(newLocale: string): void => {
				locale = newLocale;
			},
		];
	}

	fromFile(filePath: string) {
		let data = JSON.parse(readFileSync(filePath).toString());

		this.fromJSON(data);
	}

	private replaceWithKeys(
		text: string | undefined,
		keymap: object = {}
	): string | undefined {
		if (text === undefined || text === "") return undefined;

		for (let key in Object.keys(keymap)) {
			text = text.replace(`{{${key}}}`, keymap[key]);
		}

		return text;
	}
}

export { makeT as default, TFunction, TOptions, LocaleSetter };
