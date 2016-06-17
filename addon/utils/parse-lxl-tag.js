function matchParamsAndHash(string) {
  let m;
  const re = /"([^"]*)"|'([^']*)'|=|[^\s"'=]+/g;
  const params = [];

  while ((m = re.exec(string)) !== null) {
    if (m.index === re.lastIndex) {
      re.lastIndex++;
    }
    params.push(m[1] || m[2] || m[0]);
  }

  const hash = extractHash(params);

  return { hash, params };
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

export default function parseLxlTag(text) {
  const [, openingOrClosing, content] = text.match(/\(\((#|\/)?(.*?)\)\)/);
  const { params, hash } = matchParamsAndHash(content);
  const tagName = params.shift();
  const method = openingOrClosing === '/' ? 'stop' : 'start';
  const isOpening = openingOrClosing === '#';

  return {
    hash,
    isOpening,
    method,
    params,
    tagName
  };
}
