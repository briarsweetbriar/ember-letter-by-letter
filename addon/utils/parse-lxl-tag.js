export default function parseLxlTag(text) {
  const [, openingOrClosing, content] = text.match(/\(\((#|\/)?(.*?)\)\)/);
  const params = content.match(/[^\s"']+|"([^"]*)"|'([^']*)'/g);
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
