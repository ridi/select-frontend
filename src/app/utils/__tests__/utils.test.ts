import { buildAuthorString } from 'app/utils/utils';

describe('buildAuthorString', () => {
  it('should build author string correctly', () => {
    const author = { name: '이현수' };
    expect(buildAuthorString([author], '글쓴이')).toEqual('이현수 글쓴이');
    expect(buildAuthorString([author, author], '글쓴이')).toEqual('이현수, 이현수 글쓴이');
    expect(buildAuthorString([author, author, author], '글쓴이', 1)).toEqual('이현수 외 2명 글쓴이');
    expect(buildAuthorString([author, author, author], '글쓴이', 2)).toEqual('이현수, 이현수 외 1명 글쓴이');
  })
})
