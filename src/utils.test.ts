import { expect, test } from 'vitest';
import { parseColor, toColor, toPanString, toVolumeString, unescapeString } from './utils';

test('toColor', () => {
    expect(toColor(0, 0, 0, 0)).toBe('0000');
});

test('parseColor', () => {
    expect(parseColor('0000')).toBe('rgba(0,0,0,0)');
});

test('unescapeString', () => {
    expect(unescapeString('escaped')).toBe('escaped');
    expect(unescapeString('\\tescaped')).toBe('\tescaped');
    expect(unescapeString('\\tescaped\\n\\n')).toBe('\tescaped\n\n');
    expect(unescapeString('\\tescaped\\\\')).toBe('\tescaped\\');
});

test('toPanString', () => {
    expect(toPanString(0)).toBe('center');
    expect(toPanString(-1)).toBe('100%L');
    expect(toPanString(1)).toBe('100%R');
    expect(toPanString(-0.45)).toBe('45%L');
    expect(toPanString(0.78)).toBe('78%R');
});

test('toVolumeString', () => {
    expect(toVolumeString('0.0000000298023')).toBe('-inf dB');
    expect(toVolumeString('10')).toBe('20.00 dB');
});
