describe('CollapsedStory', () => {
  describe('when estimate isnt null', () => {
    it('renders the component with Story--estimated className', () => {
      cy.loginWith('foo@bar.com', 'asdfasdf');

      cy.get(':nth-child(5) > .Story')
        .should('be.visible')
        .should('have.class', 'Story--estimated')
    });
  });

  describe('when estimate is null', () => {
    it('renders the component with Story--unestimated className', () => {
      cy.get(':nth-child(1) > .Story')
      .should('be.visible')
      .should('have.class', 'Story--unestimated')
    });
  });

  describe('when storyType = release', () => {
    it('renders the component with Story--release className', () => {
      cy.get(':nth-child(4) > .Story')
      .should('be.visible')
      .should('have.class', 'Story--release')
    });
  });
});
