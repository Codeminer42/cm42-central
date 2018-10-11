import TagGroupsController from 'controllers/tag_groups/TagGroupsController';

export default () => {
  TagGroupsController();
  
  const nameConfirmation = $('#project-name-confirmation')
  const projectDeleteLink = $('#project-delete')

  nameConfirmation.keyup(() => {
    verifyProjectName()
  })
    
  function verifyProjectName() {
    if (nameConfirmation.data('project-name') == nameConfirmation.val()){
      projectDeleteLink.attr("disabled", false)
    } else {
      projectDeleteLink.attr("disabled", true)
    }
  }
};
