import React from 'react';
import { shallow, mount } from 'enzyme';
import moment from 'moment';
import StoryPopover, {
  StoryPopoverContent
} from 'components/story/StoryPopover';
import storyFactory from '../../support/factories/storyFactory';


describe("<StoryPopover />",() => {

  beforeEach(function() {
    sinon.stub(I18n, 'translate');
  });

  afterEach(function() {
    I18n.translate.restore();
  });

  it("renders the popover",() => {
    const props = storyFactory();
    const wrapper = shallow(<StoryPopover {...props} />);
    expect(wrapper.find("Popover")).toHaveProp('title', props.title);
  });
  it("renders the popover content",() => {
    const props = storyFactory();
    const wrapper = shallow(<StoryPopoverContent {...props} />);

    expect(I18n.translate).toHaveBeenCalledWith('requested by user on date', {
      user: props.requestedByName,
      date: moment(props.createdAt).format('DD MM YYYY, h:mm a')
    });
    expect(I18n.translate).toHaveBeenCalledWith('story.type.' + props.storyType);
    expect(I18n.translate).toHaveBeenCalledWith('description');
    expect(I18n.translate).toHaveBeenCalledWith('notes');

    expect(wrapper.find(`Markdown[source="${props.description}"]`)).toExist();
    props.notes.map((note) => {
      expect(wrapper.find(`Markdown[source="${note.note}"]`)).toExist(),
      expect(wrapper.find(`[data-test-id=${note.id}]`).text()).toContain(`${note.userName}`),
      expect(wrapper.find(`[data-test-id=${note.id}]`).text()).toContain(`${note.createdAt}`)
    });
  });
});
