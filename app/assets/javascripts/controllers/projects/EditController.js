import TagGroupsController from 'controllers/tag_groups/TagGroupsController';

export default () => {
  TagGroupsController();

  const nameConfirmation = $('#name_confirmation');
  const projectDeleteLink = $('#project-delete');

  nameConfirmation.keyup(() => {
    verifyProjectName();
  });

  function verifyProjectName() {
    if (nameConfirmation.data('project-name') === nameConfirmation.val()) {
      projectDeleteLink.removeAttr('disabled');
    } else {
      projectDeleteLink.attr('disabled', true);
    }
  }
};
