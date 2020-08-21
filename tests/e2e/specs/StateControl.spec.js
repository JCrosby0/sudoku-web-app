describe("State Control", () => {
  it("Can populate dummy data", () => {
    cy.visit("/");
    // load test data
    cy.get("[data-cy=navLibrary").click();
    // cy.get("[data-cy=Test]").click();
    cy.get("[data-cy=libraryInput").click();
    cy.contains("Dummy").click();
    cy.get("#r0c0").should("contain", 1);
    cy.contains("Load").click();
    cy.get("#drawer-library * .el-drawer__close-btn").click()
    // save state -- functionality disabled
    // cy.get("[data-cy=Save]").click();
  });
  // reset grid
  it("Can reset data", () => {
    cy.contains("Other").click();
    // reset to loaded state, so enter data to be reset
    cy.get("#r0c1").click();
    cy.get("body").type("2");
    cy.get("[data-cy=reset]").click();
    // confirm reset
    cy.get(".el-message-box").contains("Reset").click();
    cy.get("#r0c1").should("not.contain", 2);
  });
  it("Can check solution", () => {
    cy.get("[data-cy=navLibrary").click();
    // cy.get("[data-cy=Test]").click();
    cy.get("[data-cy=libraryInput").click();
    cy.contains("Valid Grid").click();
    cy.get("#drawer-library * .el-drawer__close-btn").click()
    cy.get("[data-cy=check]").click();
    cy.get('i').should('have.class', 'success')
  })
  // it("Can save and restore state", () => {
    // restore state -- functionality disabled
    // cy.get("[data-cy=Load]").click();
    // cy.get("#r0c1").should("contain", 1);
  // })
});
