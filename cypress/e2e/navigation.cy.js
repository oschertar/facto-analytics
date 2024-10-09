describe("Navigation", () => {
  it("should navigate to the dashboard/home page", () => {
    cy.visit("http://localhost:3000/");

    cy.get('a[href="/"]').click();

    cy.url().should("include", "/");

    cy.get("p").contains("Home Page");
  });

  it("should navigate to the emit events page", () => {
    cy.visit("http://localhost:3000/");

    cy.get('a[href*="emit-events"]').click();

    cy.url().should("include", "/emit-events");

    cy.get("p").contains("Emit Events Page");
  });

  it("should navigate to the config page", () => {
    cy.visit("http://localhost:3000/");

    cy.get('a[href*="config"]').click();

    cy.url().should("include", "/config");

    cy.get("p").contains("Config Page");
  });
});
