describe('Fail', () => {
  it('[T83] displays two todo items by default', () => {
    cy.get('.todo-list li').should('have.length', 3);
  });
});
