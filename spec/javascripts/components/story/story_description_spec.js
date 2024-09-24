import React from 'react';
import { render } from '@testing-library/react';

import StoryDescription from 'components/story/StoryDescription';

describe('<StoryDescription />', function () {
  let story;

  beforeEach(function () {
    vi.spyOn(window.md, 'makeHtml');
    story = { id: 5, description: 'Description' };
  });

  afterEach(function () {
    window.md.makeHtml.mockRestore();
  });

  it('should ignore when there are no valid ids', function () {
    window.md.makeHtml.mockReturnValueOnce('<p>Description</p>');
    const { container } = render(
      <StoryDescription
        name="description"
        linkedStories={{}}
        isReadonly={false}
        description={story.description}
        isNew={false}
        editingDescription={false}
        value={''}
      />
    );

    expect(window.md.makeHtml).toHaveBeenCalledWith('Description');
    expect(container.querySelector('.description').innerHTML).toContain(
      'Description'
    );
  });

  it('should turn a valid id into a StoryLink', function () {
    const linkedStory = {
      id: 9,
      get: vi.fn().mockImplementation(attr => {
        if (attr === 'id') return 9;
        else return 'unscheduled';
      }),
      created_at: vi.fn(),
      humanAttributeName: vi.fn(),
      escape: vi.fn(),
      hasNotes: vi.fn(),
    };

    window.md.makeHtml.mockReturnValueOnce(
      "<p>Description <a data-story-id='9'></a></p>"
    );

    const { container } = render(
      <StoryDescription
        name="description"
        linkedStories={{ 9: linkedStory }}
        isReadonly={false}
        description={'Description <a data-story-id="9"></a>'}
        isNew={false}
        editingDescription={false}
        value={''}
      />
    );

    expect(window.md.makeHtml).toHaveBeenCalledWith(
      'Description <a data-story-id="9"></a>'
    );
    expect(
      container.querySelector(`#story-link-${linkedStory.id}`)
    ).toBeInTheDocument();
  });

  it('should render markdown transformed as html', function () {
    window.md.makeHtml.mockReturnValueOnce('<h1>Header test</h1>');
    const { container } = render(
      <StoryDescription
        name="description"
        linkedStories={{}}
        isReadonly={false}
        description={'# Header test'}
        isNew={false}
        editingDescription={false}
        value={''}
      />
    );
    expect(window.md.makeHtml).toHaveBeenCalledWith('# Header test');
    expect(container.querySelector('h1')).toBeInTheDocument();
    expect(container.querySelector('h1').innerHTML).toContain('Header test');
  });
});
