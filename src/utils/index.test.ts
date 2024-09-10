import { describe, expect, test } from '@jest/globals';
import { parseContent } from './parser';

describe('parseContent ', () => {
  test('test duplicate #', () => {
    expect(parseContent('#########')).toEqual([
      {
        text: '#########',
        type: 'text',
      },
    ]);
  });
  test('test 1#123 123', () => {
    expect(parseContent('1#123 123')).toEqual([
      { text: '1', type: 'text' },
      { text: '#123', type: 'tag' },
      { text: ' 123', type: 'text' },
    ]);
  });
  test('test 1#123#234', () => {
    expect(parseContent('1#123#234')).toEqual([
      { text: '1', type: 'text' },
      { text: '#123', type: 'tag' },
      { text: '#234', type: 'tag' },
    ]);
  });
  
  test('test url', () => {
    expect(parseContent('https://www.baidu.com')).toEqual([
      { text: 'https://www.baidu.com', type: 'text' },
    ]);
  });
  test('test tag with only #',()=>{
    expect(parseContent('#')).toEqual([
      { text: '#', type: 'text' },
    ]);
  })
  test('test tag at the end',()=>{
    expect(parseContent('# ')).toEqual([
      { text: '# ', type: 'text' },
    ]);
  })
});
