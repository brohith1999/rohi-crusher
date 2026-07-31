import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import seedData from '../data/seed.json';
import { loadJSON, saveJSON, clearAll } from '../utils/storage';
import { genId } from '../utils/id';

const DataCtx = createContext(null);

const LIST_KEYS = [
  'customers', 'suppliers', 'vehicles', 'drivers', 'products',
  'weighEntries', 'production', 'sales', 'purchases', 'expenses', 'users',
];

function isoDate(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

/** Resolves relative dayOffset fields in the static seed into real ISO dates, once. */
function resolveSeed(raw) {
  const resolveList = (arr) =>
    arr.map((item) => {
      if (typeof item.dayOffset === 'number') {
        const { dayOffset, ...rest } = item;
        return { ...rest, date: isoDate(dayOffset) };
      }
      return item;
    });

  const resolved = {};
  LIST_KEYS.forEach((key) => {
    resolved[key] = resolveList(raw[key] || []);
  });
  resolved.company = raw.company;
  return resolved;
}

function loadInitialState() {
  const stamp = loadJSON('seed-anchor', null);
  if (stamp) {
    const state = {};
    let ok = true;
    LIST_KEYS.forEach((key) => {
      const v = loadJSON(key, null);
      if (v === null) ok = false;
      state[key] = v || [];
    });
    state.company = loadJSON('company', seedData.company);
    if (ok) return state;
  }
  // First run (or storage cleared): resolve seed and persist it.
  const resolved = resolveSeed(seedData);
  saveJSON('seed-anchor', new Date().toISOString().slice(0, 10));
  LIST_KEYS.forEach((key) => saveJSON(key, resolved[key]));
  saveJSON('company', resolved.company);
  return resolved;
}

export function DataProvider({ children }) {
  const [state, setState] = useState(loadInitialState);

  useEffect(() => {
    LIST_KEYS.forEach((key) => saveJSON(key, state[key]));
    saveJSON('company', state.company);
  }, [state]);

  const addItem = useCallback((entity, item, prefix) => {
    const record = { id: genId(prefix || entity.slice(0, 3)), ...item };
    setState((s) => ({ ...s, [entity]: [record, ...s[entity]] }));
    return record;
  }, []);

  const updateItem = useCallback((entity, id, patch) => {
    setState((s) => ({
      ...s,
      [entity]: s[entity].map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }));
  }, []);

  const removeItem = useCallback((entity, id) => {
    setState((s) => ({ ...s, [entity]: s[entity].filter((it) => it.id !== id) }));
  }, []);

  const updateCompany = useCallback((patch) => {
    setState((s) => ({ ...s, company: { ...s.company, ...patch } }));
  }, []);

  const resetDemoData = useCallback(() => {
    clearAll();
    window.location.reload();
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      addItem,
      updateItem,
      removeItem,
      updateCompany,
      resetDemoData,
    }),
    [state, addItem, updateItem, removeItem, updateCompany, resetDemoData]
  );

  return <DataCtx.Provider value={value}>{children}</DataCtx.Provider>;
}

export function useData() {
  const ctx = useContext(DataCtx);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
