describe("Watch Party Restrictions", () => {
  it("Checks you can't create a watch party when not logged in", () => {
    cy.visit("https://localhost:5173");
    cy.contains("a", "Watch Party").click();
    cy.contains("Button", "+ Crear Watch Party").click();
    cy.contains("button", "Crear sala").should("be.visible").and("be.disabled");
  });
});
