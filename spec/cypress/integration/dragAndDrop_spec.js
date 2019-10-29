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

    cy.matchingText({ column: 'backlog', text: 'A user should be able to create bugs' , storyPosition: 2 });
  });

  it('should dragndrop upwards', () => {

    cy.contains('A user should be able to create chores')
      .trigger('dragstart')
      .trigger('drag')

    cy.contains('A user should be able to create bugs')
      .trigger('dragover', 'bottom')
      .trigger('drop', 'bottom').wait(500)
      .trigger('dragend', 'bottom')

    cy.matchingText({ column: 'backlog', text: 'A user should be able to create chores' , storyPosition: 1 });
  });

  it('should be able to switch from backlog to chillybin', () => {
    cy.contains('A user should be able to create bugs')
      .trigger('dragstart')
      .trigger('drag')

    cy.contains('A user should be able to create features')
      .trigger('dragover')
      .trigger('drop')
      .trigger('dragend').wait(500)

    cy.matchingText({ column: 'chillyBin', text: 'A user should be able to create bugs' , storyPosition: 3 });
  });

  it('shouldnt be able to switch unestimated features from chillybin to backlog', () => {
    cy.contains('A user should be able to create features')
      .trigger('dragstart')
      .trigger('drag')

    cy.contains('A user should be able to create chores')
      .trigger('dragover')
      .trigger('drop')
      .trigger('dragend').wait(500)

    cy.matchingText({ column: 'chillyBin', text: 'A user should be able to create features' , storyPosition: 1 });
  });

  it('should be able to switch from chillybin to backlog', () => {
    cy.contains('ChillyBin to Backlog')
      .trigger('dragstart')
      .trigger('drag')

    cy.contains('A user should be able to create chores')
      .trigger('dragover')
      .trigger('drop')
      .trigger('dragend').wait(500)

    cy.matchingText({ column: 'backlog', text: 'ChillyBin to Backlog' , storyPosition: 1 });
  });

  it('shouldnt dragndrop done stories', () => {

    cy.get('[data-cy=sprints] > :nth-child(5)').click()

    cy.get('[data-cy=done] > :nth-child(1)')
      .trigger('dragstart')
      .trigger('drag')
      .invoke('text').then((text1) => {

      cy.get('[data-cy=done] > :nth-child(2)')
        .trigger('dragover', 'bottom')
        .trigger('dragend', 'bottom')

        cy.matchingText({ column: 'done', text: text1 , storyPosition: 1 });
    })
  });
});
