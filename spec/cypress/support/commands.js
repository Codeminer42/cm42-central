Cypress.Commands.add('loginWith', (email, password) => {
  cy.visit('http://localhost:3000/beta/projects/test-project')

  cy.get('#user_email')
  .type(email)

  cy.get('#user_password')
  .type(password)

  cy.get('.auth-button-submit').click()
});
