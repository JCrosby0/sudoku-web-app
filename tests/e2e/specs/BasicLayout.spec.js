// https://docs.cypress.io/api/introduction/api.html

describe("Basic Layout", () => {
  it("Contains the Nav Bar", () => {
    cy.visit("/");
    cy.contains("h3", "JC's Sudoku Grid");
    cy.contains("Create");
    cy.contains("Library");
    cy.contains("Settings");
  });
  it("Toggles the Set Tab", () => {
    cy.get("#set-container").should("not.be.visible");
    cy.get("[data-cy=navSet").click();
    cy.get("#set-container").should("be.visible");
    cy.get("#drawer-set * .el-drawer__close-btn").click()
    cy.get("#set-container").should("not.be.visible");
  });
  // it("Toggles the Input Tab", () => {
  //   cy.get("#controls-container").should("not.be.visible");
  //   cy.contains("Solve").click();
  //   cy.get("#controls-container").should("be.visible");
  //   cy.contains("Solve").click();
  //   cy.get("#controls-container").should("not.be.visible");
  // });
  it("Toggles the Library Tab", () => {
    cy.get("#library-container").should("not.be.visible");
    cy.get("[data-cy=navLibrary").click();
    cy.get("#library-container").should("be.visible");
    cy.get("#drawer-library * .el-drawer__close-btn").click()
    cy.get("#library-container").should("not.be.visible");
  });
  it("Shows the Settings Overlay", () => {
    cy.get("#settings-container").should("not.be.visible");
    cy.get("[data-cy=navSettings").click();
    cy.get("#settings-container").should("be.visible");
  });
  it("Closes the Settings Overlay with 'x'", () => {
    cy.get("#settings-container").should("be.visible");
    cy.get("#drawer-settings * .el-dialog__close").click();
    cy.get("#settings-container").should("not.be.visible");
  });
  it("Closes the Settings Overlay with 'OK'", () => {
    cy.get("[data-cy=navSettings").click();
    cy.get("#settings-container").should("be.visible");
    cy.contains("OK").click();
    cy.get("#settings-container").should("not.be.visible");
  });
  it("Closes the Settings Overlay with 'Cancel'", () => {
    cy.get("[data-cy=navSettings").click();
    cy.get("#settings-container").should("be.visible");
    cy.contains("Cancel").click();
    cy.get("#settings-container").should("not.be.visible");
  });
});
