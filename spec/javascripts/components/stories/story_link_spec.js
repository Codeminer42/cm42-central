import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import StoryLink from 'components/stories/StoryLink';

const story = {
  title: 'Story 2',
  created_at: vi.fn(),
  get: vi.fn(),
  humanAttributeName: vi.fn().mockReturnValueOnce('Description'),
  escape: vi.fn().mockReturnValueOnce('description'),
  hasNotes: vi.fn().mockReturnValueOnce(false),
  views: [{ highlight: vi.fn() }],
};

vi.spyOn(story, 'get').mockImplementation(arg => {
  switch (arg) {
    case 'id':
      return '2';
    case 'requested_by_name':
      return 'Test';
    case 'state':
      return 'unscheduled';
    case 'story_type':
      return 'feature';
  }
});

describe('<StoryLink />', function () {
  beforeEach(function () {
    vi.spyOn(I18n, 't');
    vi.spyOn(window.md, 'makeHtml');
    vi.spyOn(document, 'getElementById');
    document.getElementById.mockReturnValueOnce({ scrollIntoView: vi.fn() });
  });

  afterEach(function () {
    I18n.t.mockRestore();
    window.md.makeHtml.mockRestore();
    document.getElementById.mockRestore();
  });

  it('should have his id as content', function () {
    const { container } = render(<StoryLink story={story} />);
    expect(container.querySelector('.story-link').innerHTML).toContain('#2');
  });

  it('should highlight on click', function () {
    const { container } = render(<StoryLink story={story} />);
    const storyLink = container.querySelector('.story-link');
    fireEvent.click(storyLink);

    expect(story.views[0].highlight).toHaveBeenCalled();
  });

  describe('.story-link-icon', function () {
    it("should not exist when story's state is unscheduled", function () {
      vi.spyOn(story, 'get').mockImplementation(arg => {
        if (arg === 'state') {
          return 'unscheduled';
        }
      });
      const { container } = render(<StoryLink story={story} />);

      expect(container.querySelectorAll('.story-link-icon').length).toBe(0);
    });

    it('should have a material icon when state is not unscheduled', function () {
      vi.spyOn(story, 'get').mockImplementationOnce(arg => {
        if (arg === 'state') {
          return 'accepted';
        }
      });
      const { container } = render(<StoryLink story={story} />);
      expect(container.querySelector('.story-link-icon').innerHTML).toContain(
        'done'
      );
    });
  });
});
