describe('gestionarPerfil', () => {

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
  it('CP-071 Entrar a gestionar perfil', () => {

    cy.visit('/perfil')
    cy.contains('Gestionar Perfil').click()
    cy.url().should('include', '/gestionarPerfil')
  })
  it('CP-072 Cambiar foto de perfil', () => {

    cy.contains('Gestionar Perfil').click()
    cy.url().should('include', '/gestionarPerfil')
  })
})