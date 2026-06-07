describe('gestionar noticias', () => {

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
  it('CP-082 Seleccionar y limpiar noticias', () => {
    cy.visit('/dashboard/noticias')
    cy.contains('Seleccionar').click()
    cy.contains('Seleccionar').click()
    cy.contains('Seleccionar').click()
    cy.contains('Seleccionar').click()
    cy.contains('Limpiar').click()
  })
  it('CP-083 Pop up editar noticias', () => {
    cy.visit('/dashboard/noticias')
    cy.get('[data-cy="edit-article"]').first().click()
    cy.contains('Cancelar').click()

  })
})