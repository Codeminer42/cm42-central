describe("DragAndDrop", () => {
  const Keys = {
    space: 32,
    arrowDown: 40,
    arrowUp: 38,
    arrowLeft: 37,
    arrowRight: 39
  };

  beforeEach(() => {
    cy.app("clean"); //clean the db
    cy.app("load_seed"); // load the seeds
    cy.loginWith("foo@bar.com", "asdfasdf");
  });

  describe("Drag and drop in same column", () => {
    it("Drags from top to bottom", () => {
      const dragStory = "A user should be able to create bugs";
      const hoverStory = "A user should be able to create chores";
      // get first story
      cy.getDraggableByIndex(1)
        .as("first")
        .should("contain", dragStory);

      // get second story
      cy.getDraggableByIndex(2).should("contain", hoverStory);

      // reorder
      cy.moveStory("@first", Keys.arrowDown, Keys.space);

      // check new order
      cy.getDraggableByIndex(1).should("contain", hoverStory);
      cy.getDraggableByIndex(2).should("contain", dragStory);
    });

    it("Drags from bottom to up", () => {
      const dragStory = "A user should be able to create chores";
      const hoverStory = "A user should be able to create bugs";
      // get first story
      cy.getDraggableByIndex(1).should("contain", hoverStory);

      // get second story
      cy.getDraggableByIndex(2)
        .as("second")
        .should("contain", dragStory);

      // reorder
      cy.moveStory("@second", Keys.arrowUp, Keys.space);

      // check new order
      cy.getDraggableByIndex(1).should("contain", dragStory);
      cy.getDraggableByIndex(2).should("contain", hoverStory);
    });
  });

  describe("Drag and drop to a different column", () => {
    const backlog = 1;
    const done = 2;
    const chillyBin = 0;
    it("Drags from Backlog to ChillyBin", () => {
      const dragStory = "A user should be able to create bugs";
      // backlog column has story with id: 1
      cy.getDraggablesFromColumn(backlog).should("contain", dragStory);

      // chillyBin column does note have story with id: 1
      cy.getDraggablesFromColumn(chillyBin).should("not.contain", dragStory);

      // move story
      cy.getDraggablesFromColumn(backlog)
        .first()
        .as("drag-story")
        .moveStory("@drag-story", Keys.arrowLeft, Keys.space);

      // check new order
      cy.getDraggablesFromColumn(backlog).should("not.contain", dragStory);
      cy.getDraggablesFromColumn(chillyBin).should("contain", dragStory);
    });

    it("Drags from ChillyBin to Backlog", () => {
      const dragStory = "A user should be able to create features";
      // chillyBin column has story with id: 1
      cy.getDraggablesFromColumn(chillyBin).should("contain", dragStory);

      // backlog column does note have story with id: 1
      cy.getDraggablesFromColumn(backlog).should("not.contain", dragStory);

      // move story
      cy.getDraggablesFromColumn(chillyBin)
        .first()
        .as("drag-element")
        .moveStory("@drag-element", Keys.arrowRight, Keys.space);

      // check new order
      cy.getDraggablesFromColumn(chillyBin).should("not.contain", dragStory);
      cy.getDraggablesFromColumn(backlog).should("contain", dragStory);
    });

    it("Cannot drag to done column", () => {
      const dragStory = "A user should be able to create bugs";
      // backlog column has story with id: 1
      cy.getDraggablesFromColumn(backlog).should("contain", dragStory);

      // chillyBin column does note have story with id: 1
      cy.getDraggablesFromColumn(done).should("not.contain", dragStory);

      // move story
      cy.getDraggablesFromColumn(backlog)
        .first()
        .as("drag-story")
        .moveStory("@drag-story", Keys.arrowRight, Keys.space);

      // check new order
      cy.getDraggablesFromColumn(backlog).should("contain", dragStory);
      cy.getDraggablesFromColumn(done).should("not.contain", dragStory);
    })
  });
});
