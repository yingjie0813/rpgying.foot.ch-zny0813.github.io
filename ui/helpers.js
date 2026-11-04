/* ==================== 視覺層共用小工具 ==================== */

export const $  = (s, el) => (el || document).querySelector(s);
export const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const hash = s => { let h = 2166136261; for(const c of String(s)){ h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
