// tests/file-translation/mocks/path.test.ts
import path from 'path';

jest.mock('path', () => ({
  join: jest.fn((...paths) => paths.join('/')),
  dirname: jest.fn((filePath) => filePath.split('/').slice(0, -1).join('/')), 
  basename: jest.fn((filePath) => filePath.split('/').pop()),
  relative: jest.fn((from, to) => to.replace(from + '/', '')),
}));

describe('File Translation', () => {
  describe('FS Module', () => {
    test('join concatenates paths with forward slash', () => {
      const result = path.join('dir', 'subdir', 'file.txt');
      expect(result).toBe('dir/subdir/file.txt');
      expect(path.join).toHaveBeenCalledWith('dir', 'subdir', 'file.txt');
    });

    test('dirname returns parent directory path', () => {
      const result = path.dirname('dir/subdir/file.txt');
      expect(result).toBe('dir/subdir');
      expect(path.dirname).toHaveBeenCalledWith('dir/subdir/file.txt');
    });

    test('basename returns filename', () => {
      const result = path.basename('dir/subdir/file.txt');
      expect(result).toBe('file.txt');
      expect(path.basename).toHaveBeenCalledWith('dir/subdir/file.txt');
    });

    test('relative removes base path', () => {
      const result = path.relative('/base/path', '/base/path/subdir/file.txt');
      expect(result).toBe('subdir/file.txt');
      expect(path.relative).toHaveBeenCalledWith('/base/path', '/base/path/subdir/file.txt');
    });

    test('dirname handles root paths', () => {
      const result = path.dirname('/root.txt');
      expect(result).toBe('');
      expect(path.dirname).toHaveBeenCalledWith('/root.txt');
    });

    test('basename handles paths without directories', () => {
      const result = path.basename('file.txt');
      expect(result).toBe('file.txt');
      expect(path.basename).toHaveBeenCalledWith('file.txt');
    });
  });
});
