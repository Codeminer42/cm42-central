describe("cookiesBanner", () => {

  beforeEach(() => {
    cy.visit('/');
    
    cy.get('#user_email').type("foo@bar.com");

    cy.get('#user_password').type("asdfasdf");

    cy.get('.auth-button-submit').click();
  });

  it("should be visible when accept button was not clicked", () => {
    cy.get('.cookies-banner').should('be.visible');
  });

  it("should become hidden when accept button is clicked", () => {
    cy.get('.cookies-banner__btn').click();

    cy.get('.cookies-banner').should('not.be.visible');
  });

  it("should be visible when going to a different page", () => {
    cy.contains('New Project').click();

    cy.get('.cookies-banner').should('be.visible');
  });

  it("should be hidden when cookie already exists", () => {
    cy.setCookie('allow_cookies', 'allowed');
    cy.reload();

    cy.get('.cookies-banner').should('not.be.visible');
  });
});
