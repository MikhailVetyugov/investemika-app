import { describe, it, expect } from 'vitest'

import { parseFileName } from "../parse-file-name";

describe('parseFileName', () => {
  it('should parse file name with langugage and type', () => {
    const fileName = '2024-en-press_release.pdf';
    const parsed = parseFileName(fileName);

    expect(parsed).toEqual({
      name: fileName,
      year: 2024,
      language: 'en',
      type: 'press_release',
    });
  });

  it('should parse file name with langugage only', () => {
    const fileName = '2024-en.pdf';
    const parsed = parseFileName(fileName);

    expect(parsed).toEqual({
      name: fileName,
      year: 2024,
      language: 'en',
      type: 'financial_statement',
    });
  });

  it('should parse file name with type only', () => {
    const fileName = '2024-annual_report.pdf';
    const parsed = parseFileName(fileName);

    expect(parsed).toEqual({
      name: fileName,
      year: 2024,
      language: 'ru',
      type: 'annual_report',
    });
  });

  it('should parse file name without langugage and type', () => {
    const fileName = '2024.pdf';
    const parsed = parseFileName(fileName);

    expect(parsed).toEqual({
      name: fileName,
      year: 2024,
      language: 'ru',
      type: 'financial_statement',
    });
  });
});
