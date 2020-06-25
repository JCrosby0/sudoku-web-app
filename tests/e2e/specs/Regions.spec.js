describe("Regions", () => {
  it("Can change size of grid", () => {
    cy.visit("/");
    cy.get("#navSet").click();
    cy.get("[data-cy=puzzleSize]")
      .find("input")
      .type("{backspace}")
      .type("6")
      .type("{enter}");
    cy.get("#r8c8").should("not.exist");
  });
  it("Can change Box dimensions", () => {
    // cy.get("#navSet").click();
    cy.get("[data-cy=boxSizeHor]")
      .find("input")
      .type("{backspace}")
      .type("2")
      .type("{enter}");
    cy.get("#r2c1")
      .should("have.class", "bottomBorder")
      .should("have.class", "rightBorder");
    cy.get("[data-cy=boxSizeVer]")
      .find("input")
      .type("{backspace}")
      .type("2")
      .type("{enter}");
    cy.get("#r1c1")
      .should("have.class", "bottomBorder")
      .should("have.class", "rightBorder");
    // cy.get("#navSet").click();
    cy.get("[data-cy=boxSizeHor]")
      .find("input")
      .type("{backspace}")
      .type("3")
      .type("{enter}");
    cy.get("#r1c2")
      .should("have.class", "bottomBorder")
      .should("have.class", "rightBorder");
    cy.get("[data-cy=boxSizeVer]")
      .find("input")
      .type("{backspace}")
      .type("3")
      .type("{enter}");
    cy.get("#r2c2")
      .should("have.class", "bottomBorder")
      .should("have.class", "rightBorder");
    // reset grid back to 9x9
    cy.get("[data-cy=puzzleSize]")
      .find("input")
      .type("{backspace}")
      .type("9")
      .type("{enter}");
    cy.get("#r8c8").should("exist");
  });
  it("Can resize outer region", () => {
    // cy.get("#navSet").click();
    cy.get(".grid-inner")
      .invoke("width")
      .then(initialWidth => {
        cy.get("[data-cy=borderRows]")
          .find("input")
          .type("{backspace}")
          .type("0")
          .type("{enter}"); // reduce borderRows to 0
        // test
        cy.get(".grid-inner")
          .invoke("width")
          .should("be.greaterThan", initialWidth);
      });
    cy.get(".grid-inner")
      .invoke("width")
      .then(changedWidth => {
        cy.get("[data-cy=borderRows]")
          .find("input")
          .type("{backspace}")
          .type("2")
          .type("{enter}"); // reduce borderRows to 0
        // test
        cy.get(".grid-inner")
          .invoke("width")
          .should("be.lessThan", changedWidth);
      });
  });
  it("Can create New Region", () => {
    // open control tab
    // select region type
    // select cells
    // create region
  });
  it("Can update a Region", () => {
    // select region from list
    // change region type
    // select cells
    // update region
  });
  it("Can delete a Region", () => {
    // select region from list
    // delete region
  });
});
