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
    cy.visit('/gestionarPerfil')
    cy.get('[data-cy="editar-foto-perfil"]').click()
    cy.get('[data-cy="nueva-foto-perfil"]').first().click()
    cy.contains('Confirmar').click()
  })
  it('CP-073 Cambiar nombre', () => {
    cy.visit('/gestionarPerfil')
    cy.get('[data-cy="editar-nombre-perfil"]').click()
    cy.get('[data-cy="text-edit-nombre-perfil"]').click().type("Tester2")
    cy.contains('Confirmar').click()
    cy.get('[data-cy="editar-nombre-perfil"]').click()
    cy.get('[data-cy="text-edit-nombre-perfil"]').click().type("Tester")
    cy.contains('Confirmar').click()
  })
  it('CP-074 Asignar insignia', () => {
    cy.visit('/gestionarPerfil')
    cy.contains('Insignia de enojo').click()
    cy.contains('Sí, asignar').click()
  })
  it('CP-075 Asignar Logro', () => {
    cy.visit('/gestionarPerfil')
    cy.contains('Nivel 1').click()
    cy.contains('Sí, asignar').click()
  })
  it('CP-076 Cerrar sessión', () => {
    cy.visit('/gestionarPerfil')
    cy.contains('Cerrar sesión').click()

  })

})