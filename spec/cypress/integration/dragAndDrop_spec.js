beforeEach(() => {
  cy.loginWith('foo@bar.com', 'asdfasdf');
})

describe('Dragtest', () => {
  it('should dragndrop', () => {

    cy.get('.Sprint__body > :nth-child(1)')
      .trigger('dragstart')
      .trigger('drag')
      .invoke('text').then((text1) => {

      cy.get('.Sprint__body > :nth-child(2)')
        .trigger('dragover', 'bottom')
        .trigger('drop', 'bottom').wait(500)
        .trigger('dragend', 'bottom')

      cy.get('.Sprint__body > :nth-child(2)').invoke('text').then((text2) => {
        expect(text1).to.eq(text2)
      })
    })
  });

  it('should be able to switch from backlog to chillybin', () => {
    cy.get('.Sprint__body > :nth-child(1)')
      .trigger('dragstart')
      .trigger('drag')
      .invoke('text').then((text1) => {

      cy.get('.ProjectBoard > :nth-child(2)')
        .trigger('dragover')
        .trigger('drop')
        .trigger('dragend').wait(500)
        cy.get('.Column__body > :last-child() > .Story').invoke('text').then((text2) => {
          expect(text1).to.eq(text2)
        })
    })
  });

  it('should be able to switch from chillybin to backlog', () => {
    cy.get('.Column__body > :nth-child(1) > .Story')
      .trigger('dragstart')
      .trigger('drag')
      .invoke('text').then((text1) => {

      cy.get('.ProjectBoard > :nth-child(3)')
        .trigger('dragover')
        .trigger('drop')
        .trigger('dragend').wait(500)
      cy.get('.Sprint__body > :first-child() > .Story').invoke('text').then((text2) => {
        expect(text1).to.eq(text2)
      })
    })
  });

  it('shouldnt dragndrop done stories', () => {

    cy.get(':nth-child(5) > .Sprint__header').click()

    cy.get(':nth-child(5) > .Sprint__body > :nth-child(1) > .Story')
      .trigger('dragstart')
      .trigger('drag')
      .invoke('text').then((text1) => {

      cy.get(':nth-child(5) > .Sprint__body > :nth-child(2) > .Story')
        .trigger('dragover', 'bottom')
        .trigger('dragend', 'bottom')

      cy.get(':nth-child(5) > .Sprint__body > :nth-child(1) > .Story').invoke('text').then((text2) => {
        expect(text1).to.eq(text2)
      })
    })
  });
});
