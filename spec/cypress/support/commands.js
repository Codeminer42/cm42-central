Cypress.Commands.add('loginWith', (email, password) => {
  cy.visit('/beta/projects/test-project')

  cy.get('#user_email')
    .type(email)

  cy.get('#user_password')
    .type(password)

  cy.get('.auth-button-submit').click()
});

Cypress.Commands.add('moveStory', (dragElement, keyCode, keyEspace) => {
  cy.get(dragElement)
    .focus()
    .trigger('keydown', { keyCode: keyEspace }) // use the space key
    .trigger('keydown', { keyCode: keyCode, force: true }) // use the passed key to move the story
    // To have a nice look of the reorder movement
    .wait(0.2 * 1000)
    .trigger('keydown', { keyCode: keyEspace, force: true });
});

Cypress.Commands.add('getDraggableByIndex', (index) => {
  const draggableId = 'data-rbd-drag-handle-draggable-id';
  cy.get(`[${draggableId}]`).eq(index)
});

Cypress.Commands.add('getDraggablesFromColumn', (index) => {
  const draggableId = 'data-rbd-drag-handle-draggable-id';
  cy.get('[data-cy=column]')
    .eq(index)
    .find(`[${draggableId}]`)
});

Cypress.Commands.add('aliasUpdateStory', () => {
  cy.server();
  cy.route('PUT', '/projects/**').as('update-story');
})

Cypress.Commands.add('waitUpdateStory', (httpCode = 200) => {
  cy.wait('@update-story')
    .should('have.property', 'status', httpCode);
})
