function matchParamsAndHash(string) {
  let m;
  const re = /"([^"]*)"|'([^']*)'|[^\s"']+/g;
  const result = [];

  while ((m = re.exec(string)) !== null) {
    if (m.index === re.lastIndex) {
      re.lastIndex++;
    }
    result.push(m[1] || m[2] || m[0]);
  }

  return result;
}

export default function parseLxlTag(text) {
  const [, openingOrClosing, content] = text.match(/\(\((#|\/)?(.*?)\)\)/);
  const params = matchParamsAndHash(content);
  const tagName = params.shift();
  const method = openingOrClosing === '/' ? 'stop' : 'start';
  const isOpening = openingOrClosing === '#';

  return {
    isOpening,
    method,
    params,
    tagName
  };
}
