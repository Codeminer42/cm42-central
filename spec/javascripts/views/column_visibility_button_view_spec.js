import ColumnVisibilityButtonView from 'views/column_visibility_button_view';
import ColumnView from 'views/column_view';

describe('ColumnVisibilityButtonView', function () {
  let el;
  let view;
  let columnView;

  beforeEach(function () {
    el = $(
      '<td data-column-view="backlog" data-connect="#chilly_bin,#in_progress"></td>'
    );
    columnView = new ColumnView({ el: el });
    ColumnVisibilityButtonView.prototype.template = vi.fn();
    view = new ColumnVisibilityButtonView({ columnView: columnView });
  });

  it('should have <a> as the tagName', function () {
    expect(view.el.nodeName).toEqual('A');
  });

  it('should set its content from the ColumnView title', function () {
    expect(view.title).toEqual(columnView.title);
  });

  it('should set its class from the ColumnView id', function () {
    expect(view.$el.attr('class')).toEqual(
      'sidebar-link hide_' + columnView.id
    );
  });

  describe('toggle', function () {
    beforeEach(function () {
      columnView.toggle = vi.fn();
    });

    it('delegates to the columnView', function () {
      view.toggle();
      expect(columnView.toggle).toHaveBeenCalled();
    });
  });

  describe('setClassName', function () {
    it('sets the pressed class when the column is hidden', function () {
      columnView.hidden = vi.fn().mockReturnValueOnce(true);
      view.setClassName();
      expect(view.$el[0]).toHaveClass('pressed');
    });

    it('removes the pressed class when the column is visible', function () {
      columnView.hidden = vi.fn().mockReturnValueOnce(false);
      view.setClassName();
      expect(view.$el[0]).not.toHaveClass('pressed');
    });

    it('is bound to the columnView visibilityChanged event', function () {
      columnView.toggle();
      expect(columnView.hidden()).toBe(true);
    });
  });
});
