const NAMESPACE = 'cwms'; // Crusher & Weighbridge Management System

export function storageKey(key) {
  return `${NAMESPACE}:${key}`;
}

export function loadJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(storageKey(key));
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Failed to read "${key}" from localStorage`, err);
    return fallback;
  }
}

export function saveJSON(key, value) {
  try {
    window.localStorage.setItem(storageKey(key), JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`Failed to write "${key}" to localStorage`, err);
    return false;
  }
}

export function clearAll() {
  Object.keys(window.localStorage)
    .filter((k) => k.startsWith(`${NAMESPACE}:`))
    .forEach((k) => window.localStorage.removeItem(k));
}
