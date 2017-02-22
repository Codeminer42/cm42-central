var ColumnView = require('views/column_view');

describe("ColumnView", function() {

  beforeEach(function() {
    ColumnView.prototype.template = sinon.stub();
    this.el = $('<td data-column-view="backlog" data-connect="#chilly_bin,#in_progress"></td>');
    this.view = new ColumnView({el: this.el});
  });

  it("should be a <TD>", function() {
    expect(this.view.$el[0].nodeName).toEqual('TD');
  });

  describe("toggle", function() {

    beforeEach(function() {
      this.view.$el.toggle = sinon.spy();
    });

    it("calls jQuery.hide() on its el", function() {
      this.view.toggle();
      expect(this.view.$el.toggle).toHaveBeenCalled();
    });

    it("triggers the visibilityChanged event", function() {
      var stub = sinon.stub();
      this.view.on('visibilityChanged', stub);
      this.view.toggle();
      expect(stub).toHaveBeenCalled();
    });

  });

  describe("storyColumn", function() {
    beforeEach(function() {
      this.storyColumn = {};
      sinon.stub(this.view, '$');
      this.view.$.withArgs('.storycolumn').returns(this.storyColumn);
    });

    it("returns the story column", function() {
      expect(this.view.storyColumn()).toBe(this.storyColumn);
    });
  });

  describe("appendView", function() {

    beforeEach(function() {
      this.storyColumn = {append: sinon.stub()};
      this.view.storyColumn = sinon.stub().returns(this.storyColumn);
    });

    it("appends the view to the story column", function() {
      var view = {el: {}};
      this.view.appendView(view);
      expect(this.storyColumn.append).toHaveBeenCalledWith(view.el);
    });

  });

  describe("setSortable", function() {

    beforeEach(function() {
      this.storyColumn = {sortable: sinon.stub()};
      this.view.storyColumn = sinon.stub().returns(this.storyColumn);
    });

    it("calls sortable on the story column", function() {
      this.view.setSortable();
      expect(this.storyColumn.sortable).toHaveBeenCalled();
    });

  });

  describe("hidden", function() {

    beforeEach(function() {
      this.view.$el.is = sinon.stub();
    });

    it("returns true if the column is hidden", function() {
      this.view.$el.is.withArgs(':hidden').returns(true);
      expect(this.view.hidden()).toEqual(true);
    });

    it("returns false if the column is visible", function() {
      this.view.$el.is.withArgs(':hidden').returns(false);
      expect(this.view.hidden()).toEqual(false);
    });
  });

});
