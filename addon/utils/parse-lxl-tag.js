function parseString(string, index = 0, parentArrayAccumulator = [], arrayAccumulator = []) {
  while (index < string.length) {
    var char = string.charAt(index);

    if (char === '(') {
      [arrayAccumulator, index] = parseString(string, index + 6, arrayAccumulator);
    } else if (char === ')') {
      parentArrayAccumulator.push(arrayAccumulator);

      return [parentArrayAccumulator, index + 1];
    } else {

      var substring;

      if (char === '"') {
        [substring, index] = getNextInstance(string, index + 1, ['"']);
        index++;
      } else if (char === "'") {
        [substring, index] = getNextInstance(string, index + 1, ["'"]);
        index++;
      } else {
        [substring, index] = getNextInstance(string, index, [' ', ')']);
        if (string.charAt(index) === ' ') { index++; }
      }

      if (substring) {
        arrayAccumulator.push(substring);
      }
    }
  }
  parentArrayAccumulator.push(arrayAccumulator);
  return [parentArrayAccumulator, index];
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


// function matchParamsAndHash(string) {
//   let m;
//   const re = /"([^"]*)"|'([^']*)'|=|[^\s"'=]+/g;
//   const params = [];
//
//   while ((m = re.exec(string)) !== null) {
//     if (m.index === re.lastIndex) {
//       re.lastIndex++;
//     }
//     params.push(m[1] || m[2] || m[0]);
//   }
//
//   const hash = extractHash(params);
//
//   return { hash, params };
// }
//
// function extractHash(params) {
//   const indexes = params.reduce((indexes, param, index) => {
//     if (param === '=') {
//       indexes.push(index);
//     }
//     return indexes;
//   }, []).reverse();
//
//   return indexes.reduce((hash, index) => {
//     const [key, , value] = params.splice(index - 1, 3);
//
//     hash[key] = value;
//
//     return hash;
//   }, {});
// }

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
