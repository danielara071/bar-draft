describe('Administrar Reportes', () => {

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
  it('CP-086 Aplicar Filtro', () => {
    cy.visit('/dashboard/errorespagina')
    cy.get('select').select('Inicio')
    cy.contains('Buscar').click()
  })
  it('CP-087 Borrar Campos', () => {
    cy.visit('/dashboard/errorespagina')
    cy.contains('Borrar campos').click()
    cy.contains('PANTALLA').should('be.visible')



  })
})