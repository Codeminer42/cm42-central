import React from 'react';
import { render } from '@testing-library/react';

import StoryTasks from 'components/story/StoryTasks';

describe('<StoryTasks />', function () {
  beforeEach(function () {
    vi.spyOn(I18n, 't');
  });

  afterEach(function () {
    I18n.t.mockRestore();
  });

  it('should render a list of <Task /> components', function () {
    const get = word => {
      if (word === 'id') return 1;
      if (word === 'name') return 'name';
      if (word === 'done') return 'done';
    };

    const task = {
      get,
      escape: vi.fn().mockReturnValueOnce('Test'),
      id: 1,
    };

    const { container } = render(
      <StoryTasks tasks={[task]} disabled={false} />
    );
    expect(container.querySelector('.task')).toBeInTheDocument();
  });

  describe('with an empty collection', function () {
    it('should still have a label', function () {
      render(<StoryTasks tasks={[]} disabled={false} />);
      expect(I18n.t).toHaveBeenCalledWith('story.tasks');
    });
  });
});
