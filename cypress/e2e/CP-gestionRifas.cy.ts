describe('gestionar Rifas', () => {

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
  it('CP-086 Publicar nueva Rifa sin nombre', () => {
    cy.visit('/dashboard/rifas')
    cy.contains('Añadir Rifa').click()
    cy.contains('Publicar Rifa').click()
    cy.contains('El nombre es obligatorio.').should('be.visible')
  })
  it('CP-087 Cancelar Eliminar Rifa', () => {
    cy.visit('/dashboard/rifas')
    cy.contains('Eliminar Rifa').click()
    cy.contains('Cancelar').click()



  })
})