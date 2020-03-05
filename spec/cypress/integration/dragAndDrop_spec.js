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

    cy.aliasUpdateStory();
  });

  describe("Drag and drop in same column", () => {
    it("Drags from top to bottom", () => {
      const dragStory = "A user should be able to create bugs";
      const hoverStory = "A user should be able to create chores";
      // get first story
      cy.getDraggableByIndex(2)
        .as("first")
        .should("contain", dragStory);

      // get second story
      cy.getDraggableByIndex(3).should("contain", hoverStory);

      // reorder
      cy.moveStory("@first", Keys.arrowDown, Keys.space);

      cy.waitUpdateStory(200);

      // check new order
      cy.getDraggableByIndex(2).should("contain", hoverStory);
      cy.getDraggableByIndex(3).should("contain", dragStory);
    });

    it("Drags from bottom to up", () => {
      const dragStory = "A user should be able to create chores";
      const hoverStory = "A user should be able to create bugs";
      // get first story
      cy.getDraggableByIndex(2).should("contain", hoverStory);

      // get second story
      cy.getDraggableByIndex(3)
        .as("second")
        .should("contain", dragStory);

      // reorder
      cy.moveStory("@second", Keys.arrowUp, Keys.space);

      // check new order
      cy.getDraggableByIndex(2).should("contain", dragStory);
      cy.getDraggableByIndex(3).should("contain", hoverStory);
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

      // chillyBin column does not have story with id: 1
      cy.getDraggablesFromColumn(chillyBin).should("not.contain", dragStory);

      // move story
      cy.getDraggablesFromColumn(backlog)
        .first()
        .as("drag-story")
        .moveStory("@drag-story", Keys.arrowLeft, Keys.space);

      cy.waitUpdateStory(200);

      // check new order
      cy.getDraggablesFromColumn(backlog).should("not.contain", dragStory);
      cy.getDraggablesFromColumn(chillyBin).should("contain", dragStory);
    });

    describe('Drags from ChillyBin to Backlog', () => {
      it("When story is a feature and is estimated", () => {

        const dragStory = "A user should be able to create features";
        // chillyBin column has story with id: 1
        cy.getDraggablesFromColumn(chillyBin).should("contain", dragStory);

        // backlog column does not have story with id: 1
        cy.getDraggablesFromColumn(backlog).should("not.contain", dragStory);

        cy.get('.Story__estimate')
          .first()
          .click();

        cy.waitUpdateStory(200);

        // move story
        cy.getDraggablesFromColumn(chillyBin)
          .first()
          .as("drag-element")
          .moveStory("@drag-element", Keys.arrowRight, Keys.space);

        cy.waitUpdateStory(200);

        // check new order
        cy.getDraggablesFromColumn(chillyBin).should("not.contain", dragStory);
        cy.getDraggablesFromColumn(backlog).should("contain", dragStory);
      });

      it("When story is a bug", () => {
        const dragStory = "A user should be able drag this story from chilly bean and drop to backlog";
        // chillyBin column has story with id: 1
        cy.getDraggablesFromColumn(chillyBin).should("contain", dragStory);

        // backlog column does not have story with id: 1
        cy.getDraggablesFromColumn(backlog).should("not.contain", dragStory);

        // move story
        cy.getDraggablesFromColumn(chillyBin)
          .eq(1)
          .as("drag-element")
          .moveStory("@drag-element", Keys.arrowRight, Keys.space);

        cy.waitUpdateStory(200);

        // check new order
        cy.getDraggablesFromColumn(chillyBin).should("not.contain", dragStory);
        cy.getDraggablesFromColumn(backlog).should("contain", dragStory);
      });

      it("Cannot drag a feature and not estimated story to Backlog", () => {
        const dragStory = "A user should be able to create features";
        // chillyBin column has story with id: 1
        cy.getDraggablesFromColumn(chillyBin).should("contain", dragStory);

        // backlog column does not have story with id: 1
        cy.getDraggablesFromColumn(backlog).should("not.contain", dragStory);

        // move story
        cy.getDraggablesFromColumn(chillyBin)
          .first()
          .as("drag-element")
          .moveStory("@drag-element", Keys.arrowRight, Keys.space);

        cy.waitUpdateStory(200);

        // check new order
        cy.getDraggablesFromColumn(chillyBin).should("contain", dragStory);
        cy.getDraggablesFromColumn(backlog).should("not.contain", dragStory);
      });
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
