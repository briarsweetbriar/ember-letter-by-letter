function parseString(string, index = 0, parentAccumulator = [], isHash = false) {
  let accumulator = [];

  while (index < string.length) {
    const char = string.charAt(index);

    if (char === '(') {
      index = handleOpenParenthesis(string, index + 1, accumulator);
    } else if (char === ')') {
      index++; break;
    } else {
      index = appendNextSubstring(string, char, index, accumulator);
    }
  }

  appendToParent(parentAccumulator, accumulator, isHash);

  return { accumulator: parentAccumulator, index };
}

function appendToParent(parentAccumulator, accumulator, isHash) {
  const child = isHash ? toHash(accumulator) : accumulator;

  parentAccumulator.push(child);
}

function handleOpenParenthesis(string, index, accumulator) {
  const method = string.substring(index, string.indexOf(' ', index));

  switch (method) {
    case 'array': return parseString(string, index + method.length, accumulator).index;
    case 'hash': return parseString(string, index + method.length, accumulator, true).index;
    default: return index;
  }
}

function toHash(params) {
  const indexes = params.reduce((indexes, param, index) => {
    if (param === '=') {
      indexes.push(index);
    }
    return indexes;
  }, []).reverse();

  return indexes.reduce((hash, index) => {
    const [key, , value] = params.splice(index - 1, 3);

    hash[key] = value;

    return hash;
  }, {});
}

function appendNextSubstring(string, char, startIndex, accumulator) {
  let { index, substring } = matchSubstring(string, char, startIndex);

  while (string.charAt(index) === char) { index++; }

  if (substring === substring) {
    accumulator.push(substring);
  }

  return index;
}

function matchSubstring(string, char, index) {
  switch (char) {
    case '"': return extractSubstring(string, index + 1, [char]);
    case "'": return extractSubstring(string, index + 1, [char]);
    case '=': return { substring: char, index: index + 1 };
    default: return extractSubstring(string, index, [' ', ')', '=']);
  }
}

function extractSubstring(string, startIndex, chars) {
  let index = startIndex;
  while (index < string.length) {
    if (chars.indexOf(string.charAt(index)) > -1) { break; }

    index++;
  }

  const substring = parseSubstring(string.substring(startIndex, index));

  return {
    substring,
    index
  };
}

function parseSubstring(substring) {
  if (!isNaN(substring) && substring.charAt(0) !== '+') {
    return parseFloat(substring);
  } else if (substring === 'true') {
    return true;
  } else if (substring === 'false') {
    return false;
  } else {
    return substring;
  }
}

function determineMethod(tagType) {
  switch (tagType) {
    case '#': return { isOpening: true, method: 'open' };
    case '/': return { isClosing: true, method: 'close' };
    default: return { method: 'execute' };
  }
}

export default function parseLxlTag(text) {
  const [, tagType, content] = text.match(/\[\[(#|\/)?(.*?)\]\]/);
  const { isClosing, isOpening, method } = determineMethod(tagType);
  const { accumulator: [params] } = parseString(content);
  const tagName = params.shift();

  return {
    isClosing,
    isOpening,
    method,
    params,
    tagName
  };
}
