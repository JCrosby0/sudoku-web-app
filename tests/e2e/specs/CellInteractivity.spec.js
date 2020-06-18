describe("Cell Interactivity", () => {
  it("Shows cursor when clicked", () => {
    cy.visit("/");
    cy.get("#r0c0").click();
    cy.get("#r0c0").should("have.class", "selected");
  });
  it("Clears when clicked outside grid", () => {
    cy.get(".grid-outer").click("top");
    cy.get("#r0c0").should("not.have.class", "selected");
  });
  it("Selects when clicked", () => {
    cy.get("#r0c1").click();
    cy.get("#r0c1").should("have.class", "selected");
  });
  it("Moves cursor with arrow keys", () => {
    cy.get("body").type("{rightarrow}");
    cy.get("#r0c2").should("have.class", "selected");
    cy.get("body").type("{downarrow}");
    cy.get("#r1c2").should("have.class", "selected");
    cy.get("body").type("{leftarrow}");
    cy.get("#r1c1").should("have.class", "selected");
    cy.get("body").type("{uparrow}");
    cy.get("#r0c1").should("have.class", "selected");
  });
  it("Updates Highlights when new cell clicked", () => {
    cy.get("#r0c2").click();
    cy.get("#r0c2").should("have.class", "selected");
    cy.get("#r0c1").should("not.have.class", "selected");
  });
  it("Selects multipe cells when shift+click", () => {
    cy.get("#r0c3").click();
    cy.get("body").type("{shift}", {
      release: false
    });
    cy.get("#r1c4").click();
    cy.wrap(["#r0c3", "#r0c4", "#r1c3", "#r1c4"]).each(cell => {
      cy.get(cell).should("have.class", "selected");
    });
  });
  it("Selects multiple cells when ctrl+click", () => {
    cy.get("#r0c5").click();
    const testCells = ["#r2c5", "#r4c5", "#r6c5", "#r8c5"];
    cy.wrap(testCells).each(cell => {
      cy.get("body").type("{ctrl}", {
        release: false
      });
      cy.get(cell).click();
    });
    cy.wrap(testCells).each(cell => {
      cy.get(cell).should("have.class", "selected");
    });
  });
  it("Enters value when typed", () => {
    cy.get("#r0c6").click();
    cy.get("body").type("1");
    cy.get("#r1c6").click();
    cy.get("body").type("2");
    cy.get("#r2c6").click();
    cy.get("body").type("3");
    cy.get("#r0c6").should("contain", "1");
    cy.get("#r1c6").should("contain", "2");
    cy.get("#r2c6").should("contain", "3");
  });
  it("Enters mid notes when typed with control", () => {
    cy.get("#r0c7").click();
    cy.get("body").type("{ctrl}", {
      release: false
    });
    cy.get("body").type("{ctrl}4");
    cy.get("body").type("{ctrl}5");
    cy.get("body").type("{ctrl}6");
    cy.get("#r0c7").should("contain", "456");
  });
  it("Enters top notes when typed with shift", () => {
    cy.get("#r0c8").click();
    cy.get("body").type("{shift}7");
    cy.get("body").type("{shift}8");
    cy.get("body").type("{shift}9");
    cy.get("#r0c8").should("contain", "789");
  });
  it("Highlights cells when clicked with alt", () => {
    cy.get("body").type("{alt}", {
      release: false
    });
    cy.get("#r2c6").click();
    const highlightCells = [
      "#r0c8", // box
      "#r2c0", // row
      "#r8c6" // column
    ];
    cy.wrap(highlightCells).each(cell => {
      cy.get(cell).should("have.class", "highlighted");
    });
  });
});
