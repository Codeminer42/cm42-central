const ColumnVisibilityButtonView = require('views/column_visibility_button_view');
const ColumnView = require('views/column_view');

describe('ColumnVisibilityButtonView', () => {
  beforeEach(function () {
    this.el = $('<td data-column-view="backlog" data-connect="#chilly_bin,#in_progress"></td>');
    this.columnView = new ColumnView({ el: this.el });
    ColumnVisibilityButtonView.prototype.template = sinon.stub();
    this.view = new ColumnVisibilityButtonView({ columnView: this.columnView });
  });

  it('should have <a> as the tagName', function () {
    expect(this.view.el.nodeName).toEqual('A');
  });

  it('should set its content from the ColumnView title', function () {
    expect(this.view.title).toEqual(this.columnView.title);
  });

  it('should set its class from the ColumnView id', function () {
    expect(this.view.$el.attr('class')).toEqual(`sidebar-link hide_${this.columnView.id}`);
  });

  describe('toggle', () => {
    beforeEach(function () {
      this.columnView.toggle = sinon.stub();
    });

    it('delegates to the columnView', function () {
      this.view.toggle();
      expect(this.columnView.toggle).toHaveBeenCalled();
    });
  });

  describe('setClassName', () => {
    it('sets the pressed class when the column is hidden', function () {
      this.columnView.hidden = sinon.stub().returns(true);
      this.view.setClassName();
      expect(this.view.$el).toHaveClass('pressed');
    });

    it('removes the pressed class when the column is visible', function () {
      this.columnView.hidden = sinon.stub().returns(false);
      this.view.setClassName();
      expect(this.view.$el).not.toHaveClass('pressed');
    });

    it('is bound to the columnView visibilityChanged event', function () {
      this.columnView.toggle();
      expect(this.columnView.hidden()).toBe(true);
    });
  });
});
