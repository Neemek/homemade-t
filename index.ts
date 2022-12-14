import { readFileSync } from "fs";

interface TOptions {
	onlySingleSpaces?: boolean;
	noTrailingSpaces?: boolean;
}

interface TFunction {
	(key: string, keymap?: object, options?: TOptions): string;
}

interface LocaleSetter {
	(locale: string): void;
}

interface MakeT {
	locale: string;
	fromJSON(data: object): [TFunction, LocaleSetter];
	fromJSONFile(filePath: string): [TFunction, LocaleSetter];
	replaceWithKeys(text: string | undefined, keymap: object): string | undefined;
}

export class TMaker implements MakeT {
	constructor(public locale: string) {}
	fromJSON(data: object): [TFunction, LocaleSetter] {
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
		} catch (e) {
			throw e;
		}
		return [
			(
				key: string,
				keymap: object = {},
				options: TOptions = { onlySingleSpaces: true, noTrailingSpaces: true }
			): string => {
				let value = this.replaceWithKeys(
					lookup.get(this.locale).get(key),
					keymap
				);
				if (value === undefined) return key;

				if (options.onlySingleSpaces)
					value = value?.replace(/ {2,}/g, " ").replace(/ (?=[\!\?])/g, "");

				return value;
			},
			(newLocale: string): void => {
				this.locale = newLocale;
			},
		];
	}

	fromJSONFile(filePath: string): [TFunction, LocaleSetter] {
		let data = JSON.parse(readFileSync(filePath).toString());

		return this.fromJSON(data);
	}

	replaceWithKeys(
		text: string | undefined,
		keymap: object = {}
	): string | undefined {
		if (Object.keys(keymap).length === 0) return text;
		if (text === undefined || text === "") return undefined;

		for (let key of Object.keys(keymap)) {
			text = text.replace(`{{${key}}}`, keymap[key]);
		}

		return text.replace(/\{\{[\w\.]+\}\}/g, "");
	}
}

//*   Test case:
// const [t, setLocale] = makeT.fromJSON(
// 	{
// 		en: {
// 			"info.hello": "Hello {{adjectives}} {{subject}}!",
// 			"info.subjects.world": "world",
// 			"info.adjectives.cool": "cool",
// 		},
// 		es: {
// 			"info.hello": "Hola {{subject}} {{adjectives}}!",
// 			"info.subjects.world": "mundo",
// 			"info.adjectives.cool": "genial",
// 		},
// 	},
// 	"en"
// );

// // Locale is by default english (defined in init as "en")
// console.log(t("info.hello", { subject: t("info.subjects.world") }));
// console.log(
// 	t("info.hello", {
// 		subject: "Monkee 🐒",
// 		adjectives: t("info.adjectives.cool"),
// 	})
// );

// setLocale("es"); // Change locale to Español  (Spanish)
// console.log(t("info.hello", { subject: t("info.subjects.world") })); // Outputs: Hola mundo!
// console.log(
// 	t("info.hello", {
// 		subject: "Monkee 🐒",
// 		adjectives: t("info.adjectives.cool"),
// 	})
// );

// export { makeT as default, TFunction, TOptions, LocaleSetter };
