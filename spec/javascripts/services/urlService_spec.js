import * as UrlService from '../../../app/assets/javascripts/services/urlService';

describe('Services of Url', () => {
  let originalHash;

  beforeEach(() => {
    originalHash = window.location.hash;
  })

  afterEach(() => {
    window.location.hash = originalHash;
  })

  it('Should return storyId from hash', () => {
    const wordHash = '#story-';

    const storyId = 127;

    window.location.hash = `${wordHash}${storyId}`;

    expect(UrlService.getHash(wordHash)).toEqual(storyId);
  });

  it('Should return null from empty hash', () => {
    const wordHash = 'example';

    expect(UrlService.getHash(wordHash)).toEqual(null);
  });

  it('Should return null from hash that do not includes the word', () => {
    const wordHash = '#wrongWordHash';
    
    window.location.hash = '#example';
    
    expect(UrlService.getHash(wordHash)).toEqual(null);
  })
});
