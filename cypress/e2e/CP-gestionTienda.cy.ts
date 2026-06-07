describe('gestionar elementos de Tienda', () => {

beforeEach(() => {

    cy.session('test-user', () => {

      cy.request({
        method: 'POST',
        url: `${Cypress.env('VITE_SUPABASE_URL')}/auth/v1/token?grant_type=password`,
        headers: {
          apikey: Cypress.env('VITE_SUPABASE_ANON_KEY')
        },
        body: {
          email: Cypress.env('TEST_EMAIL'),
          password: Cypress.env('TEST_PASSWORD')
        }
      }).then(({ body }) => {

        window.localStorage.setItem(
          'sb-vsywrimuzdnfyztreolz-auth-token',
          JSON.stringify(body)
        )

      })

    })

  })
  it('CP-084 Cancelar Edición', () => {
    cy.visit('/dashboard/tienda')
    cy.get('[data-cy="edit-product-panel"]').first().click()
    cy.contains('Cancelar').click()
  })
  it('CP-085 Cancelar Eliminar', () => {
    cy.visit('/dashboard/tienda')
    cy.contains('Agregar').click()
    cy.contains('Cancelar').click()



  })
})