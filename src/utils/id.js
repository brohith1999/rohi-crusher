let counter = 0;

/** Generates a short unique id without extra dependencies. */
export function genId(prefix = 'id') {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}${counter.toString(36)}`;
}

export function genSlipNo(prefix, seq) {
  return `${prefix}-${String(seq).padStart(5, '0')}`;
}
