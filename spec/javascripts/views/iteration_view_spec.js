import IterationView from 'views/iteration_view';

describe('IterationView', function () {
  let view;
  let iteration;

  beforeEach(function () {
    var Iteration = Backbone.Model.extend({
      name: 'iteration',
      points: function () {
        return 999;
      },
      acceptedPoints: function () {
        return 555;
      },
      startDate: function () {
        return new Date('2011/09/26');
      },
    });
    iteration = new Iteration({ number: 1 });
    IterationView.prototype.template = vi.fn();
    view = new IterationView({ model: iteration });
  });

  it('should have a div as its top level element', function () {
    expect(view.el.nodeName).toEqual('DIV');
  });

  it('should have a class of iteration', function () {
    expect(view.$el[0]).toHaveClass('iteration');
  });

  describe('render', function () {
    it('renders the output of the template into the el', function () {
      view.render();
      expect(view.$el.html()).toContain('<span class="points">999</span>');
    });
  });

  describe('points', function () {
    it('displays points when column is not #in_progress', function () {
      iteration.set({ column: '#backlog' });
      expect(view.points()).toEqual(999);
    });

    it('displays accepted / total when column is #in_progress', function () {
      iteration.set({ column: '#in_progress' });
      expect(view.points()).toEqual('555/999');
    });
  });
});
