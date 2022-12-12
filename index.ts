import { readFileSync } from 'fs';

interface tFunction {
    (key: string, lang?: string): string
}

function newTFunction(translationFile: string): tFunction | undefined {
    const lookup = new Map<string, Map<string, string>>();
    let data = JSON.parse(readFileSync(translationFile).toString())

    try {
        for (let localizationKey of Object.keys(data)) {
            const localization = new Map<string, string>();
            const localizationData = data[localizationKey];
            for (let valueKey of Object.keys(localizationData)) {
                localization.set(valueKey, localizationData[valueKey])
            }

            lookup.set(localizationKey, localization)
        }
    } catch {
        return undefined
    }

    return (key: string, lang: string = 'en'): string => {
        return lookup.get(lang)?.get(key) ?? "";
    }
}

export default newTFunction;
