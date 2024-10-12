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

    cy.get(".select-events-arrow").click();
    cy.get("#react-select-2-listbox").contains("div", "click_cta").click();

    cy.get(".select-events").should("contain", "click_cta");

    cy.get('button[type="submit"]').click();

    cy.get("div").contains("Data along this period");
    cy.get("div").contains("Highest number of click_cta");
    cy.get("div").contains("Lowest number of click_cta");

    cy.get(".recharts-surface").should("be.visible");

    cy.get("div").contains("Average events per day").should("be.visible");

    cy.get("dd").contains("124").should("be.visible");
    cy.get("dd").contains("50").should("be.visible");

    cy.get(".recharts-layer.recharts-area").first().trigger("mouseover");
    cy.get(".recharts-tooltip-wrapper").should("be.visible");

    cy.get(".recharts-layer.recharts-area").first().click();
    cy.get("div").contains("Details for").should("be.visible");
  });
});
