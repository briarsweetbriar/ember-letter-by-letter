export default function addClassTo(classNames, string) {
  if (string.charAt(1) === '/') { return string; }

  const index = string.indexOf('class=');
  const classString = classNames.join(' ');

  if (index > -1) {
    const indexEnd = index + 7;

    return `${string.slice(0, indexEnd)}${classString} ${string.slice(indexEnd)}`;
  } else {
    return `${string.slice(0, -1)} class="${classString}">`;
  }
}
