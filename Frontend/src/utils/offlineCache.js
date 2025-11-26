export function storeLastKnown(cityKey, resp) {
  try {
    localStorage.setItem(`last-weather:${cityKey}`, JSON.stringify(resp));
  } catch {}
}

export function getLastKnown(cityKey) {
  try {
    return JSON.parse(localStorage.getItem(`last-weather:${cityKey}`) || null);
  } catch {
    return null;
  }
}
