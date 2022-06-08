describe("cookiesBanner", () => {

  beforeEach(() => {
    cy.visit('/');
  });

  it("displays cookies consent banner when user hasn't accepted yet", () => {
    cy.get('.cookies-banner').should('be.visible');
  });

  it("hides cookies consent banner when user clicks accept button", () => {
    cy.get('.cookies-banner__btn').click();

    cy.get('.cookies-banner').should('not.be.visible');
  });

  it("displays cookies consent banner when user goes to a different page", () => {
    cy.contains('Sign up').click();

    cy.get('.cookies-banner').should('be.visible');
  });

  it("hides the cookies consent banner when they have already been accepted", () => {
    cy.setCookie('allow_cookies', 'allowed');
    cy.reload();

    cy.get('.cookies-banner').should('not.be.visible');
  });
});
