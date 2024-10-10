describe("Metric", () => {
  it("should send a metric", () => {
    const NAME_EVENT = "click_cta";
    const VALUE_EVENT = "10";
    const ACCOUNT_ID = "1";
    cy.intercept("POST", "/api/postMetric", {
      statusCode: 200,
      body: {
        message: "Metric sent successfully",
        data: {
          created_at: new Date().toISOString(),
          name: NAME_EVENT,
          value: VALUE_EVENT,
          account: ACCOUNT_ID,
        },
      },
    }).as("postMetric");

    cy.visit("http://localhost:3000/emit-events");

    cy.get('input[name="name"]').type(NAME_EVENT);
    cy.get('input[name="value"]').type(VALUE_EVENT);
    cy.get('input[name="account"]').type(ACCOUNT_ID);
    cy.get('button[type="submit"]').click();

    cy.wait("@postMetric");

    cy.url().should("include", "/emit-events");

    cy.get("div").contains("Success! Metric sent successfully");
  });

  it("shouldn't send a metric", () => {
    const NAME_EVENT = "click_cta";
    const VALUE_EVENT = "10";
    const ACCOUNT_ID = "-1";

    cy.intercept("POST", "/api/postMetric", {
      statusCode: 400,
      body: {
        message: "Error sending metric",
        data: {
          created_at: new Date().toISOString(),
          name: NAME_EVENT,
          value: VALUE_EVENT,
          account: ACCOUNT_ID,
        },
      },
    }).as("postMetric");

    cy.visit("http://localhost:3000/emit-events");

    cy.get('input[name="name"]').type(NAME_EVENT);
    cy.get('input[name="value"]').type(VALUE_EVENT);
    cy.get('input[name="account"]').type(ACCOUNT_ID);
    cy.get('button[type="submit"]').click();

    cy.wait("@postMetric");

    cy.url().should("include", "/emit-events");

    cy.get("div").contains("Error sending metric");
  });
});
