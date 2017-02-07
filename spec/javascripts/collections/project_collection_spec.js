var ProjectCollection = require('collections/project_collection');

describe('ProjectCollection', function() {
  describe('#archived', function() {
    describe('when collection is empty', function() {
      it('returns an empty collection', function() {
        const projects = new ProjectCollection();
        const archivedProjects = projects.archived();

        expect(archivedProjects.size()).toEqual(0);
      });
    });

    describe('when collection is not empty', function() {
      it('returns archived projects', function() {
        const projects = new ProjectCollection();
        projects.reset([
          { 'name': 'Foo', 'slug': 'foo', 'archived_at': '2015/10/22 11:25:44 -0200' },
          { 'name': 'Bar', 'slug': 'bar', 'archived_at': null }
        ]);
        const archivedProjects = projects.archived();

        expect(archivedProjects.size()).toEqual(1);
      });
    });
  });

  describe('#notArchived', function() {
    it('returns an empty collection', function() {
      const projects = new ProjectCollection();
      const notArchivedProjects = projects.notArchived();

      expect(notArchivedProjects.size()).toEqual(0);
    });

    it('returns not archived projects', function() {
      const projects = new ProjectCollection();
      projects.reset([
        { 'name': 'Foo', 'slug': 'foo', 'archived_at': '2015/10/22 11:25:44 -0200' },
        { 'name': 'Bar', 'slug': 'bar', 'archived_at': null },
        { 'name': 'Bar', 'slug': 'bar', 'archived_at': null }
      ]);
      const notArchivedProjects = projects.notArchived();

      expect(notArchivedProjects.size()).toEqual(2);
    });
  });
});
