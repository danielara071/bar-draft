import React from 'react'
import Perfil from './Perfil'

describe('<Perfil />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Perfil />)
  })
})