import React from 'react'
import Tienda from './Tienda'

describe('<Tienda />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Tienda />)
  })
})