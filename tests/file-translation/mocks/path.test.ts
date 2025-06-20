// tests/file-translation/mocks/path.test.ts
import path from 'path';

jest.mock('path', () => ({
  join: jest.fn((...paths) => paths.join('/')),
  dirname: jest.fn(path => {
    const parts = path.split('/');
    parts.pop();
    return parts.join('/');
  }),
  basename: jest.fn(path => path.split('/').pop()),
  relative: jest.fn((from, to) => to.replace(from + '/', ''))
}));

describe('File Translation', () => {
  describe('Path Module', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('join concatenates paths with forward slash', () => {
      const result = path.join('dir', 'subdir', 'file.txt');
      expect(result).toBe('dir/subdir/file.txt');
    });

    test('dirname returns parent directory path', () => {
      const result = path.dirname('dir/subdir/file.txt');
      expect(result).toBe('dir/subdir');
    });

    test('basename returns filename', () => {
      const result = path.basename('dir/subdir/file.txt');
      expect(result).toBe('file.txt');
    });

    test('relative removes base path', () => {
      const result = path.relative('/base/path', '/base/path/subdir/file.txt');
      expect(result).toBe('subdir/file.txt');
    });

    test('dirname handles root paths', () => {
      const result = path.dirname('/root.txt');
      expect(result).toBe('');
    });

    test('basename handles paths without directories', () => {
      const result = path.basename('file.txt');
      expect(result).toBe('file.txt');
    });
  });
});
