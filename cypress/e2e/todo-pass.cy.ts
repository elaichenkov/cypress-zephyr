describe('Pass', () => {
  it('[T123] displays two todo items by default', () => {
    cy.visit('https://example.cypress.io/todo');
    cy.get('.todo-list li').should('have.length', 2);
  });
});
