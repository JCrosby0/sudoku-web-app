describe("Demo Solve", () => {
  it("Loads a puzzle", () => {
    cy.visit("/");
    cy.get("[data-cy=navLibrary]").click()
    cy.get("[data-cy=libraryInput]").click()
    cy.contains("Easy").click()
    cy.contains("Load").click()
    cy.get("#r0c1").should('contain', 3)
  });
  it("Solves a puzzle", () => {
    const solutionPath = [
      [2, 2, 2],
      [6, 4, 2],
      [3, 3, 2],
      [4, 0, 2],
      [7, 6, 2],
      [4, 1, 5],
      [0, 8, 5],
      [7, 1, 6],
      [4, 7, 7],
      [1, 8, 7],
      [2, 5, 7],
      [0, 0, 7],
      [6, 1, 7],
      [7, 2, 8],
      [8, 0, 5],
      [0, 2, 4],
      [1, 1, 9],
      [2, 1, 8],
      [5, 1, 4],
      [5, 0, 8],
      [3, 0, 9],
      [0, 7, 1],
      [0, 3, 5],
      [1, 3, 1],
      [1, 6, 3],
      [2, 6, 5],
      [2, 3, 3],
      [8, 3, 6],
      [2, 4, 4],
      [6, 6, 9],
      [4, 6, 1],
      [3, 6, 4],
      [5, 4, 1],
      [8, 4, 3],
      [4, 5, 4],
      [3, 5, 3],
      [3, 8, 8],
      [5, 8, 3],
      [6, 5, 8],
      [8, 5, 1],
      [8, 7, 8],
      [7, 7, 3],
      [6, 8, 5],
      [7, 8, 1]
    ]
    cy.wrap(solutionPath).each(step => {
      cy.get(`#r${step[0]}c${step[1]}`).click()
      cy.get('body').type(step[2])
    })
  });
  it('Checks the answer', () => {
    
    cy.contains("Other").click()
    cy.get('[data-cy=check]').click()
    cy.get('i').should('have.class', 'success')
  })
});
