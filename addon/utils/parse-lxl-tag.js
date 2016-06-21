function parseString(string, index = 0, parentAccumulator = [], isHash = false) {
  let arrayAccumulator = [];

  while (index < string.length) {
    const char = string.charAt(index);

    if (char === '(') {
      [arrayAccumulator, index] = handleOpenParenthesis(string, index, arrayAccumulator);
    } else if (char === ')') {
      index++;

      break;
    } else {
      index = extractSubstring(string, char, index, arrayAccumulator);
    }
  }

  pushToParent(parentAccumulator, arrayAccumulator, isHash);

  return [parentAccumulator, index];
}

function handleOpenParenthesis(string, index, arrayAccumulator) {
  const method = string.substring(index + 1, string.indexOf(' ', index));

  switch (method) {
    case 'array': return parseString(string, index + 6, arrayAccumulator);
    case 'hash': return parseString(string, index + 5, arrayAccumulator, true);
    default: return [arrayAccumulator, index++];
  }
}

function extractSubstring(string, char, index, arrayAccumulator) {
  let substring;

  switch (char) {
    case '"': [substring, index] = getNextInstance(string, index + 1, ['"']); index++; break;
    case "'": [substring, index] = getNextInstance(string, index + 1, ["'"]); index++; break;
    case '=': substring = '='; index++; break;
    default: [substring, index] = getNextInstance(string, index, [' ', ')', '=']); if (string.charAt(index) === ' ') { index++; } break;
  }

  if (substring) {
    arrayAccumulator.push(substring);
  }

  return index;
}

function pushToParent(parentAccumulator, arrayAccumulator, isHash) {
  if (isHash) {
    parentAccumulator.push(extractHash(arrayAccumulator));
  } else {
    parentAccumulator.push(arrayAccumulator);
  }
}

function getNextInstance(string, startIndex, chars) {
  var index = startIndex;
  while (index < string.length) {
    if (chars.indexOf(string.charAt(index)) > -1) {
      return [string.substring(startIndex, index), index];
    }

    index += 1;
  }

  return [string.substring(startIndex, index), index];
}

function extractHash(params) {
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
  const [[params]] = parseString(content);
  const tagName = params.shift();

  return {
    isClosing,
    isOpening,
    method,
    params,
    tagName
  };
}
