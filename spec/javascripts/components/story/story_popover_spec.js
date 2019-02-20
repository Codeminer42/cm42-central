import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment';
import StoryPopover, {
  StoryPopoverContent
} from 'components/story/StoryPopover';
import storyFactory from '../../support/factories/storyFactory';


describe("<StoryPopover />", () => {

  beforeEach(function() {
    sinon.stub(I18n, 't');
  });

  afterEach(function() {
    I18n.t.restore();
  });

  it("renders the popover",() => {
    const props = storyFactory();
    const wrapper = shallow(<StoryPopover story={props} />);
    expect(wrapper.find("Popover").prop('title')).toBe(props.title);
  });
  it("renders the popover content",() => {
    const props = storyFactory();
    const wrapper = shallow(<StoryPopoverContent story={props} />);

    expect(I18n.t).toHaveBeenCalledWith('requested by user on date', {
      user: props.requestedByName,
      date: moment(props.createdAt).format('DD MM YYYY, h:mm a')
    });
    expect(I18n.t).toHaveBeenCalledWith('story.type.' + props.storyType);
    expect(I18n.t).toHaveBeenCalledWith('description');
    expect(I18n.t).toHaveBeenCalledWith('notes');

    expect(wrapper.find(`Markdown[source="${props.description}"]`)).toExist();
    props.notes.map((note) => {
      expect(wrapper.find(`Markdown[source="${note.note}"]`)).toExist(),
      expect(wrapper.find(`[data-test-id=${note.id}]`).text()).toContain(`${note.userName}`),
      expect(wrapper.find(`[data-test-id=${note.id}]`).text()).toContain(`${note.createdAt}`)
    });
  });
});
