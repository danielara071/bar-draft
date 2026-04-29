describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://localhost:5173')
    cy.contains('a', 'Tienda').click()
    cy.contains('Button', 'Comprar').click()
    cy.contains('button', 'Cancelar')
    .should('be.visible')
    .click()
  })
}) 