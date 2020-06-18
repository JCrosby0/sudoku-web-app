// https://docs.cypress.io/api/introduction/api.html

describe("Basic Layout", () => {
  it("Contains the Nav Bar", () => {
    cy.visit("/");
    cy.contains("h2", "JC's Sudoku Grid");
    cy.contains("Input");
    cy.contains("Rules");
    cy.contains("Settings");
  });
  it("Toggles the Input Tab", () => {
    cy.get("#controls-container").should("not.be.visible");
    cy.contains("Input").click();
    cy.get("#controls-container").should("be.visible");
    cy.contains("Input").click();
    cy.get("#controls-container").should("not.be.visible");
  });
  it("Toggles the Rules Tab", () => {
    cy.get("#rules-container").should("not.be.visible");
    cy.contains("Rules").click();
    cy.get("#rules-container").should("be.visible");
    cy.contains("Rules").click();
    cy.get("#rules-container").should("not.be.visible");
  });
  it("Shows the Settings Overlay", () => {
    cy.get("#settings-container").should("not.be.visible");
    cy.get("#navSettings").click();
    cy.get("#settings-container").should("be.visible");
  });
  it("Closes the Settings Overlay with 'x'", () => {
    cy.get("#settings-container").should("be.visible");
    cy.get(".el-dialog__close").click();
    cy.get("#settings-container").should("not.be.visible");
  });
  it("Closes the Settings Overlay with 'OK'", () => {
    cy.get("#navSettings").click();
    cy.get("#settings-container").should("be.visible");
    cy.contains("OK").click();
    cy.get("#settings-container").should("not.be.visible");
  });
  it("Closes the Settings Overlay with 'Cancel'", () => {
    cy.get("#navSettings").click();
    cy.get("#settings-container").should("be.visible");
    cy.contains("Cancel").click();
    cy.get("#settings-container").should("not.be.visible");
  });
});
