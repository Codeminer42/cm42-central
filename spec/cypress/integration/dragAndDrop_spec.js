describe('Dragtest', () => {

  beforeEach(() => {
    cy.app('load_seed');
    cy.loginWith('foo@bar.com', 'asdfasdf');
  })

  it('should dragndrop downwards', () => {

    cy.contains('A user should be able to create bugs')
      .trigger('dragstart')
      .trigger('drag')

    cy.contains('A user should be able to create chores')
      .trigger('dragover', 'bottom')
      .trigger('drop', 'bottom').wait(500)
      .trigger('dragend', 'bottom')

    cy.get('.Sprint__body > :nth-child(2)')
      .contains('A user should be able to create bugs')
  });

  it('should dragndrop upwards', () => {

    cy.contains('A user should be able to create chores')
      .trigger('dragstart')
      .trigger('drag')

    cy.contains('A user should be able to create bugs')
      .trigger('dragover', 'bottom')
      .trigger('drop', 'bottom').wait(500)
      .trigger('dragend', 'bottom')

    cy.get('.Sprint__body > :nth-child(1)')
      .contains('A user should be able to create chores')
  });

  it('should be able to switch from backlog to chillybin', () => {
    cy.contains('A user should be able to create bugs')
      .trigger('dragstart')
      .trigger('drag')

    cy.contains('A user should be able to create features')
      .trigger('dragover')
      .trigger('drop')
      .trigger('dragend').wait(500)

    cy.get('.Column__body > :last-child() > .Story')
      .contains('A user should be able to create bugs')
  });

  it('should be able to switch from chillybin to backlog', () => {
    cy.contains('A user should be able to create features')
      .trigger('dragstart')
      .trigger('drag')

    cy.contains('A user should be able to create chores')
      .trigger('dragover')
      .trigger('drop')
      .trigger('dragend').wait(500)

    cy.get('.Sprint__body > :first-child > .Story')
      .contains('A user should be able to create features')
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
