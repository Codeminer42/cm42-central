import ColumnView from 'views/column_view';

describe("ColumnView", function() {
  let el;
  let view;

  beforeEach(function() {
    ColumnView.prototype.template = sinon.stub();
    el = $('<td data-column-view="backlog" data-connect="#chilly_bin,#in_progress"></td>');
    view = new ColumnView({el: el});
  });

  it("should be a <TD>", function() {
    expect(view.$el[0].nodeName).toEqual('TD');
  });

  describe("toggle", function() {

    beforeEach(function() {
      view.$el.toggle = sinon.spy();
    });

    it("calls jQuery.hide() on its el", function() {
      view.toggle();
      expect(view.$el.toggle).toHaveBeenCalled();
    });

    it("triggers the visibilityChanged event", function() {
      var stub = sinon.stub();
      view.on('visibilityChanged', stub);
      view.toggle();
      expect(stub).toHaveBeenCalled();
    });

  });

  describe("storyColumn", function() {
    let storyColumn;

    beforeEach(function() {
      storyColumn = {};
      sinon.stub(view, '$');
      view.$.withArgs('.story_column').returns(storyColumn);
    });

    it("returns the story column", function() {
      expect(view.storyColumn()).toBe(storyColumn);
    });
  });

  describe("appendView", function() {
    let storyColumn;

    beforeEach(function() {
      storyColumn = {append: sinon.stub()};
      view.storyColumn = sinon.stub().returns(storyColumn);
    });

    it("appends the view to the story column", function() {
      var currentView = {el: {}};
      view.appendView(currentView);
      expect(storyColumn.append).toHaveBeenCalledWith(currentView.el);
    });

  });

  describe("setSortable", function() {
    let storyColumn;

    beforeEach(function() {
      storyColumn = {sortable: sinon.stub()};
      view.storyColumn = sinon.stub().returns(storyColumn);
    });

    it("calls sortable on the story column", function() {
      view.setSortable();
      expect(storyColumn.sortable).toHaveBeenCalled();
    });

  });

  describe("hidden", function() {

    beforeEach(function() {
      view.$el.is = sinon.stub();
    });

    it("returns true if the column is hidden", function() {
      view.$el.is.withArgs(':hidden').returns(true);
      expect(view.hidden()).toEqual(true);
    });

    it("returns false if the column is visible", function() {
      view.$el.is.withArgs(':hidden').returns(false);
      expect(view.hidden()).toEqual(false);
    });
  });

});
