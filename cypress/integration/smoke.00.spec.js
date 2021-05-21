/// <reference types="cypress" />

describe('/', () => {
  it('returns JSON', () => {
    cy.request('/')
      .its('body')
      .should('include', 'Make Crypto Great!')
  });
});

describe('/coins', () => {
  it('returns JSON', () => {
    cy.request('/coins')
      .its('headers')
      .its('content-type')
      .should('include', 'application/json')
  });
});

describe('/news', () => {
  it('returns JSON', () => {
    cy.request('/news?q=DOGE')
      .its('headers')
      .its('content-type')
      .should('include', 'application/json')
  });
});

describe.skip('/coin-info', () => {
  it('returns JSON', () => {
    cy.request('/coin-info?symbol=XRP')
      .its('headers')
      .its('content-type')
      .should('include', 'application/json')
  });
});

describe('/coin-latest', () => {
  it('returns JSON', () => {
    cy.request('/coin-latest?symbol=LTC')
      .its('headers')
      .its('content-type')
      .should('include', 'application/json')
  });
});
