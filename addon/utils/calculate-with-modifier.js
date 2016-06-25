export default function calculateWithModifier(initialValue, modifier) {
  modifier = modifier.toString();

  const operator = modifier.charAt(0);
  const modifierValue = parseFloat(modifier.substring(1));
  switch (operator) {
    case '*': return initialValue * modifierValue;
    case '+': return initialValue + modifierValue;
    case '/': return initialValue / modifierValue;
    case '-': return initialValue - modifierValue;
    case '%': return initialValue % modifierValue;
    default: return parseFloat(modifier);
  }
}
