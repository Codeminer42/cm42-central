import React from 'react';
import { render } from '@testing-library/react';
import moment from 'moment';
import StoryPopover, {
  StoryPopoverContent,
} from 'components/story/StoryPopover';
import storyFactory from '../../support/factories/storyFactory';
import { beforeAll } from 'vitest';

describe('<StoryPopover />', () => {
  let props;

  beforeAll(() => {
    props = storyFactory();
  });

  beforeEach(function () {
    vi.spyOn(I18n, 't');
    vi.spyOn(window.md, 'makeHtml').mockReturnValue(
      `<p>${props.description}</p>`
    );
  });

  afterEach(function () {
    I18n.t.mockRestore();
    window.md.makeHtml.mockRestore();
  });

  it('renders the popover', () => {
    const props = storyFactory();
    const { getByTestId } = render(<StoryPopover story={props} />);

    const popoverChildren = getByTestId('story-popover-children');

    expect(popoverChildren).toBeInTheDocument();
  });

  it('renders the popover content', () => {
    const { container } = render(<StoryPopoverContent story={props} />);
    const markdown = container.querySelector(`.Markdown`);

    expect(I18n.t).toHaveBeenCalledWith('requested by user on date', {
      user: props.requestedByName,
      date: moment(props.createdAt, 'YYYY/MM/DD').format('DD MM YYYY, h:mm a'),
    });
    expect(I18n.t).toHaveBeenCalledWith('story.type.' + props.storyType);
    expect(I18n.t).toHaveBeenCalledWith('description');
    expect(I18n.t).toHaveBeenCalledWith('notes');

    expect(markdown.innerHTML).toContain(props.description);
  });

  it('renders the popover notes', () => {
    const props = storyFactory();
    const { getAllByTestId } = render(<StoryPopoverContent story={props} />);

    const notes = getAllByTestId('markdown-wrapper-text');

    props.notes.map((note, index) => {
      expect(notes[index].innerHTML).toContain(`${note.userName}`);
      expect(notes[index].innerHTML).toContain(`${note.createdAt}`);
    });
  });
});
