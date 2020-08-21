describe("On Screen Controls", () => {
  it("Can input numbers", () => {
    cy.visit("/");
    cy.contains("Input").click();
    cy.get("#r3c0").click();
    cy.get("[data-cy=1]").click();
    cy.get("#r3c0").should("contain", 1)
    cy.get("#r3c1").click();
    cy.get("[data-cy=2]").click();
    cy.get("#r3c1").should("contain", 2)
    cy.get("#r3c2").click();
    cy.get("[data-cy=3]").click();
    cy.get("#r3c2").should("contain", 3)
  });
  it("Can delete numbers", () => {
    cy.contains("Delete").click();
    cy.get("#r3c2").should('not.contain', 3);
  });
  it("Can toggle id and top notes", () => {
    cy.get("[data-cy=Top]").click();
    cy.get("#r4c0").click();
    cy.get("[data-cy=4]").click();
    cy.get("#r4c0 > .notesTop").should('contain', 4)
    // check top value
    cy.get("[data-cy=Mid]").click();
    cy.get("#r5c0").click();
    cy.get("[data-cy=5]").click();
    cy.get("#r5c0 > .notesMid").should('contain', 5)

  });
  it("Responds to shift and control presses", () => {
    cy.get("[data-cy=Normal]").click();
    cy.get("body").type("{shift}", {
      release: false
    });
    cy.get("[data-cy=Normal]").should("have.class", "el-button--primary");
    cy.get("[data-cy=Top]").should("have.class", "el-button--primary");
    cy.get("body").type("{shift}"); // to release modifier
    cy.get("[data-cy=Normal]").should("not.have.class", "el-button--primary");
    cy.get("[data-cy=Top]").should("not.have.class", "el-button--primary");
    cy.get("body").type("{control}", {
      release: false
    });
    cy.get("[data-cy=Mid]").should("have.class", "el-button--primary");
    cy.get("body").type("{control}"); // to release modifier
    cy.get("[data-cy=Mid]").should("not.have.class", "el-button--primary");
  });
  it("Updates toggle with spacebar", () => {
    cy.get("body").type(" ");
    cy.get("[data-cy=Top]").should("have.class", "el-button--primary");
    cy.get("body").type(" ");
    cy.get("[data-cy=Mid]").should("have.class", "el-button--primary");
    cy.get("body").type(" ");
    cy.get("[data-cy=Normal]").should("have.class", "el-button--primary");
  });
});
