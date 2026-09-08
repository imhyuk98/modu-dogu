import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decodeSocial, encodeSocial, socialModes, socialGames, validAnswers, isComparison, socialScore } from '../lib/social-games.ts';
import { birthdayPhase, decodeMoon, encodeMoon, moonStory } from '../lib/birthday-moon.ts';

for (const mode of socialModes) {
  const answers = Array(socialGames[mode].questions.length).fill(0);
  const invite = { v: 1, mode, kind: 'invite', id: 'test-1', creator: '한글 🌱', answers: isComparison(mode) ? answers : [] };
  test(`${mode}: invitation and result round trip`, () => {
    assert.deepEqual(decodeSocial(encodeSocial(invite), mode), invite);
    const result = { ...invite, kind: 'result', guest: '친구', replies: answers };
    assert.deepEqual(decodeSocial(encodeSocial(result), mode), result);
    assert.ok(encodeSocial(result).length < 2400);
  });
  test(`${mode}: reject partial, sparse and invalid responses`, () => {
    assert.equal(validAnswers(mode, answers.slice(1)), false);
    const sparse = []; sparse[answers.length - 1] = 0;
    assert.equal(validAnswers(mode, sparse), false);
    for (const invalid of [-1, 99, 0.5, null, '0', false]) assert.equal(validAnswers(mode, [invalid, ...answers.slice(1)]), false);
    for (const changed of [{ v: 2 }, { creator: '' }, { creator: 'a'.repeat(13) }, { creator: 'a\nb' }, { id: '<script>' }, { kind: 'other' }, { kind: 'result' }, { replies: answers }]) {
      assert.equal(decodeSocial(encodeSocial({ ...invite, ...changed }), mode), null);
    }
  });
}
test('corrupt and cross-game links fail closed', () => {
  for (const raw of ['', '!', 'a'.repeat(2401), btoa('null'), btoa('{}'), btoa('[]')]) assert.equal(decodeSocial(raw, 'friendship-quiz'), null);
  const payload = { v: 1, mode: 'friend-manual', kind: 'invite', id: 'a', creator: '나', answers: [] };
  assert.equal(decodeSocial(encodeSocial(payload), 'compliment-card'), null);
});
test('scores distinguish exact guesses from differing tastes', () => {
  assert.deepEqual(socialScore([0, 1, 2, 3], [0, 1, 2, 3]), { matches: 4, total: 4, percent: 100 });
  assert.equal(socialScore([0, 1], [1, 0]).percent, 0);
  assert.equal(socialScore([0, 1, 0], [0, 0, 0]).percent, 67);
});
test('moon date validation, approximate anchor and phase range', () => {
  const now = new Date('2026-09-07T12:00:00Z');
  for (const raw of ['', '2001-02-29', '2000-02-30', '2026-09-08', '1899-12-31', 'x', '2000-13-01']) assert.equal(birthdayPhase(raw, now), null);
  assert.notEqual(birthdayPhase('2000-02-29', now), null);
  assert.equal(birthdayPhase('2000-01-06', now), 0);
  assert.equal(birthdayPhase('2000-01-21', now), 4);
  for (let year = 1900; year <= 2026; year++) { const phase = birthdayPhase(`${year}-01-01`, now); assert.ok(Number.isInteger(phase) && phase >= 0 && phase < 8); }
});
test('moon links contain only nickname and phase, not dates; symmetric story', () => {
  const card = { first: '나 & 🌙', second: '친구', a: 0, b: 4 };
  assert.deepEqual(decodeMoon(encodeMoon(card)), card);
  assert.deepEqual([...new URLSearchParams(encodeMoon(card)).keys()], ['v', 'first', 'second', 'a', 'b']);
  for (const raw of ['', 'v=1&first=a&second=b&a=8&b=1', 'v=2&first=a&second=b&a=0&b=1']) assert.equal(decodeMoon(raw), null);
  for (let a = 0; a < 8; a++) for (let b = 0; b < 8; b++) assert.deepEqual(moonStory(a, b), moonStory(b, a));
});
