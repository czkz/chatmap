import AggressiveTokenizerRu from './natural/aggressive_tokenizer_ru.js';
import PorterStemmerRu from './natural/porter_stemmer_ru.js';

const tokenizer = new AggressiveTokenizerRu();

function tokenize(text) {
    return tokenizer.tokenize(text);
}

function stem(word) {
    return PorterStemmerRu.stem(word);
}

function startsWithCapital(word) {
    return word[0] === word[0].toUpperCase();
}

function nameTokens(text) {
    return tokenize(text).filter(startsWithCapital).map(stem);
}

function cityToken(str, cityInfo) {
    const words = nameTokens(str);
    for (const w of words.reverse()) {
        if (w == stem('область'))  { continue; }
        if (w == stem('край'))     { continue; }
        if (w == stem('сити'))     { continue; }
        if (w == stem('city'))     { continue; }
        if (w == stem('страна'))   { continue; }
        if (w == stem('город'))    { continue; }
        if (w == stem('district')) { continue; }
        if (w == stem('район'))    { continue; }
        if (w == stem('округ'))    { continue; }
        if (w.length <= 2)         { continue; }
        if (w.length <= 3 && cityInfo.country != 'Russia') {
            continue;
        }
        return w;
    }
}

export { tokenize, stem, startsWithCapital, nameTokens, cityToken };
