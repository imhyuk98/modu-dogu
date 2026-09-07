import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function harness(consent = 'granted') {
  const events = [], refs = [], timers = new Map();
  let index = 0, sequence = 0, effectDeps, cleanup;
  const window = { localStorage: { getItem: () => consent }, gtag: (...args) => events.push(args) };
  const context = vm.createContext({ window, exports: {}, setTimeout: fn => { timers.set(++sequence, fn); return sequence; }, clearTimeout: id => timers.delete(id) });
  const evaluate = path => vm.runInContext(ts.transpileModule(readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, context);
  evaluate('lib/analytics.ts');
  const analytics = context.exports;
  context.exports = {};
  context.require = name => name === '@/lib/analytics' ? analytics : {
    useRef: value => refs[index++] ?? (refs[index - 1] = { current: value }),
    useCallback: fn => fn,
    useEffect: (fn, deps) => { if (!effectDeps || deps[0] !== effectDeps[0]) { cleanup?.(); cleanup = fn(); effectDeps = deps; } },
  };
  evaluate('lib/useToolMeasurement.ts');
  return { events, window, render(key = null) { index = 0; return context.exports.useToolMeasurement('test-tool', key); }, flush() { for (const [id, fn] of timers) { timers.delete(id); fn(); } }, unmount() { cleanup?.(); } };
}

test('default auto result is not a completion; interaction is debounced and deduplicated', () => {
  const h = harness(); const m = h.render('default'); h.flush(); assert.equal(h.events.length, 0);
  m.start(); h.render('edited'); h.render('edited-again'); h.flush(); m.complete(); m.start();
  assert.deepEqual(h.events.map(e => e[1]), ['tool_start', 'tool_complete']);
  assert.equal(JSON.stringify(h.events).includes('edited'), false);
});
test('invalid results and unmounted pages cancel pending completion', () => {
  const h = harness(); h.render('default').start(); h.render('valid'); h.render(null); h.flush();
  assert.equal(h.events.length, 1);
  h.render('valid'); h.unmount(); h.flush(); assert.equal(h.events.length, 1);
});
test('denied consent does not emit start, completion or sharing', () => {
  const h = harness('denied'); const m = h.render(); m.start(); m.complete(); m.share();
  assert.equal(h.events.length, 0);
});
test('blocked storage and failing analytics never break tools', () => {
  const h = harness(); const m = h.render();
  h.window.localStorage.getItem = () => { throw Error('blocked'); };
  assert.doesNotThrow(m.complete);
  h.window.localStorage.getItem = () => 'granted';
  h.window.gtag = () => { throw Error('blocked'); };
  assert.doesNotThrow(m.complete);
});
test('successful completion has a start and clipboard sharing carries no input data', () => {
  const h = harness(); const m = h.render(); m.complete(); m.complete(); m.share();
  assert.deepEqual(h.events.map(e => e[1]), ['tool_start', 'tool_complete', 'result_share']);
  assert.deepEqual(Object.keys(h.events[2][2]).sort(), ['measurement_version', 'method', 'tool']);
});
