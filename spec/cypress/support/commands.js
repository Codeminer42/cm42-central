Cypress.Commands.add('loginWith', (email, password) => {
  cy.visit('/beta/projects/test-project')

  cy.get('#user_email')
  .type(email)

  cy.get('#user_password')
  .type(password)

  cy.get('.auth-button-submit').click()
});

Cypress.Commands.add('matchingText', ({ column, text, storyPosition }) => {
  cy.get(`[data-cy=${column}] > :nth-child(${storyPosition})`)
    .contains(text)
});
