describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it.only('should be able to navigate from the home page to the history page', () => {
    cy.fixture('user').then((user) => {
      cy.get('p')
        .should(($p) => {
          expect($p).to.contain(user.email);
        })
        .get('p', { timeout: 10000 })
        .should(($p) => {
          expect($p).to.contain('No links to display');
        })
        .get('[aria-label="menu"]')
        .click()
        .get('a')
        .contains('History')
        .click()
        .url()
        .should('include', '/history')
        .get('p', { timeout: 10000 })
        .should(($p) => {
          expect($p).to.contain('The history is empty');
        });
    });
  });
});
