# Homemade T 🍵

> _just for you 😎_

## But how? 🍵

The first thing to do, is importing the `homemade-t` module.

```js
const { TMaker } = require("homemade-t");
const makeT = new TMaker("en");
```

`makeT` makes `T` functions (obviously).
There are several ways of importing data:

```js
const t = makeT.fromJSON(
	{
		// returns a TFunction
		en: {
			"info.helloworld": "Hello world!",
		},
		es: {
			"info.helloworld": "Hola mundo!",
		},
	}
);
```

or

```js
const [t, setLocale] = makeT.fromJSONFile("./translations.json"); // also returns a TFunction
```

### JSON data format 🪅

```json
{
	// First is language locale (top level)
	"en": {
		// Inside you would put the keys
		"info.hello": "Hello {{adjectives}} {{subject}}!", // "category.key"
		"info.subjects.world": "world",
		"info.adjectives.cool": "cool" // "category.subcategory.key"
	},
	"es": {
		"info.hello": "Hola {{subject}} {{adjectives}}!", // Woah! Adjectives behind???
		"info.subjects.world": "mundo",
		"info.adjectives.cool": "genial"
	}
}
```

> The above data is used as test data below

### Usage 🫖

```js
// Locale is by default english (defined in init as "en")
console.log(t("info.hello", { subject: t("world") })); // Outputs: Hello world!
console.log(
	t("info.hello", {
		subject: "Monkee 🐒",
		adjectives: t("info.adjectives.cool"),
	})
); // Outputs: Hello cool Monkee 🐒!

setLocale("es"); // Change locale to Español (Spanish)
console.log(t("info.hello", { subject: t("world") })); // Outputs: Hola mundo!
console.log(
	t("info.hello", {
		subject: "Monkee 🐒",
		adjectives: t("info.adjectives.cool"),
	})
); // Outputs: Hola Monkee 🐒 genial!
```

> _Note that this is only an example and is not a realistic use case._
