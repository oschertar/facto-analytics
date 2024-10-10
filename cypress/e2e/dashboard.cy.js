describe("Dashboard", () => {
  it("should show the dashboard page", () => {
    cy.visit("http://localhost:3000/");

    cy.get("p").contains("Home Page");
  });

  it("should show the dashboard page with data", () => {
    cy.intercept("GET", "/api/metrics", {
      statusCode: 200,
      body: {
        message: "Data retrieved successfully",
        data: {
          results: [
            {
              created_at: "2024-08-25T00:00:00+00:00",
              click_cta: 50,
            },
            {
              created_at: "2024-08-26T00:00:00+00:00",
              click_cta: 95,
            },
            {
              created_at: "2024-08-27T00:00:00+00:00",
              click_cta: 85,
            },
            {
              created_at: "2024-08-28T00:00:00+00:00",
              click_cta: 110,
            },
            {
              created_at: "2024-08-29T00:00:00+00:00",
              click_cta: 92,
            },
            {
              created_at: "2024-08-30T00:00:00+00:00",
              click_cta: 124,
            },
            {
              created_at: "2024-08-31T00:00:00+00:00",
              click_cta: 115,
            },
          ],
          statistics: {
            max: {
              value: 124,
              date: "30 August",
              name: "click_cta",
            },
            min: {
              value: 50,
              date: "25 August",
              name: "click_cta",
            },
          },
        },
      },
    }).as("getMetrics");

    cy.visit("http://localhost:3000/");
    cy.get("p").contains("Home Page");

    cy.get('input[type="date"]:first').should("be.visible").type("2024-08-25");
    cy.get('input[type="date"]:last').should("be.visible").type("2024-08-31");
    cy.get("select").should("be.visible").select("G-1245475412");
    cy.get(".select-events")
      .should("be.visible")
      .type("click_cta")
      .type("{enter}");

    cy.get('button[type="submit"]').click();

    cy.get("div").contains("Data along this period");
    cy.get("div").contains("Highest number of click_cta");
    cy.get("div").contains("Lowest number of click_cta");
  });
});
