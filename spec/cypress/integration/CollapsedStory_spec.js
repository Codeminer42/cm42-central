describe('CollapsedStory', () => {

  beforeEach(() => {
    cy.app('load_seed');
  });

  it('renders the component with Story--estimated className', () => {
    cy.loginWith('foo@bar.com', 'asdfasdf');

    cy.get(':nth-child(4) > .Story')
      .should('be.visible')
      .should('have.class', 'Story--estimated')
  });

  it('renders the component with Story--unestimated className', () => {
    cy.get('.Column__body > :nth-child(1) > .Story')
    .should('be.visible')
    .should('have.class', 'Story--unestimated')
  });

  it('renders the component with Story--release className', () => {
    cy.get(':nth-child(3) > .Story')
    .should('be.visible')
    .should('have.class', 'Story--release')
  });
});
