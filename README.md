# Homemade T 🍵

> _just for you 😎_

## Usage 🫖

The first thing to do, is importing the `homemade-t` module.

```js
const { makeT } = require("homemade-t");
```

`makeT` is makes `T` functions (obviously).
There are several ways of importing data:

```js
makeT.fromJSON({ // returns a TFunction
	en: {
		"info.helloworld": "Hello world!",
	},
	es: {
		"info.helloworld": "Hola mundo!",
	},
});
 
makeT.fromJSONFile("./translations.json"); // also returns a TFunction
```

## JSON data format 🪅

```json
{
	// First is language locale (top level)
	"en": {
		// Inside you would put the keys
		"info.helloworld": "Hello {{adjectives}} {{subject}}!", // "category.key"
		"info.adjectives.cool": "cool" // "category.subcategory.key"
	},
	"es": {
		"info.helloworld": "Hola {{subject}} {{adjectives}}!", // Placing
		"info.adjectives.cool": "genial" // "category.key"
	}
}
```
