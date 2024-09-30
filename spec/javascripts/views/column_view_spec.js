import ColumnView from 'views/column_view';

describe('ColumnView', function () {
  let el;
  let view;

  beforeEach(function () {
    ColumnView.prototype.template = vi.fn();
    el = $(
      '<td data-column-view="backlog" data-connect="#chilly_bin,#in_progress"></td>'
    );
    view = new ColumnView({ el: el });
  });

  it('should be a <TD>', function () {
    expect(view.$el[0].nodeName).toEqual('TD');
  });

  describe('toggle', function () {
    beforeEach(function () {
      view.$el.toggle = vi.fn();
    });

    it('calls jQuery.hide() on its el', function () {
      view.toggle();
      expect(view.$el.toggle).toHaveBeenCalled();
    });

    it('triggers the visibilityChanged event', function () {
      var stub = vi.fn();
      view.on('visibilityChanged', stub);
      view.toggle();
      expect(stub).toHaveBeenCalled();
    });
  });

  describe('storyColumn', function () {
    let storyColumn;

    beforeEach(function () {
      storyColumn = {};
      vi.spyOn(view, '$').mockImplementation(arg => {
        if (arg === '.story_column') return storyColumn;
      });
    });

    it('returns the story column', function () {
      expect(view.storyColumn()).toBe(storyColumn);
    });
  });

  describe('appendView', function () {
    let storyColumn;

    beforeEach(function () {
      storyColumn = { append: vi.fn() };
      view.storyColumn = vi.fn().mockReturnValueOnce(storyColumn);
    });

    it('appends the view to the story column', function () {
      var currentView = { el: {} };
      view.appendView(currentView);
      expect(storyColumn.append).toHaveBeenCalledWith(currentView.el);
    });
  });

  describe('setSortable', function () {
    let storyColumn;

    beforeEach(function () {
      storyColumn = { sortable: vi.fn() };
      view.storyColumn = vi.fn().mockReturnValueOnce(storyColumn);
    });

    it('calls sortable on the story column', function () {
      view.setSortable();
      expect(storyColumn.sortable).toHaveBeenCalled();
    });
  });

  describe('hidden', function () {
    beforeEach(function () {
      view.$el.is = vi.fn();
    });

    it('returns true if the column is hidden', function () {
      vi.spyOn(view.$el, 'is').mockImplementation(arg => {
        if (arg === ':hidden') return true;
      });
      expect(view.hidden()).toEqual(true);
    });

    it('returns false if the column is visible', function () {
      vi.spyOn(view.$el, 'is').mockImplementation(arg => {
        if (arg === ':hidden') return false;
      });
      expect(view.hidden()).toEqual(false);
    });
  });
});
