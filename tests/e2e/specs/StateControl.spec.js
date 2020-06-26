describe("State Control", () => {
  it("Can populate dummy data", () => {
    cy.visit("/");
    // load test data
    cy.get("[data-cy=Test]").click();
    cy.get("#r0c0").should("contain", 1);
    // save state
    cy.get("[data-cy=Save]").click();
  });
  // reset grid
  it("Can reset data", () => {
    cy.get("[data-cy=Reset]").click();
    // confirm reset
    cy.get("[data-cy=Reset]").click();
    cy.get("#r0c0").should("not.contain", 1);
  });
  it("Can save and restore state", () => {
    // restore state
    cy.get("[data-cy=Load]").click();
    cy.get("#r0c0").should("contain", 1);
  })
});
