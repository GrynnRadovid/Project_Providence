describe('Main Page', () => {
  beforeEach(() => {
    cy.visit('');
  });

  it('should display login form when user is not logged in', () => {
    cy.get('.login-overlay').should('be.visible');
    cy.get('.user-info').should('not.exist');
    cy.get('app-login').should('be.visible');
  });

  it('should display registration form when clicking "Register here"', () => {
    cy.get('a').contains('Register here').click();
    cy.get('app-registration').should('be.visible');
    cy.get('app-login').should('not.exist');
  });

  it('should display login form when clicking "Log in here" from registration', () => {
    cy.get('a').contains('Register here').click();
    cy.get('a').contains('Log in here').click();
    cy.get('app-login').should('be.visible');
    cy.get('app-registration').should('not.exist');
  });

  it('should display user info when logged in', () => {
    // Visit the main page
    cy.visit('');

    // Fill out the login form
    cy.get('#username').type('testuser');
    cy.get('#password').type('testpassword');

    // Click the login button
    cy.get('button[type=submit]').click(); // Update this selector to target the actual login button

    // Wait for the login process to complete
    cy.wait(1000); // You might need to adjust this value, or use `cy.wait` with an alias to a specific request if applicable

    // Check that user info is displayed now that the user is logged in
    cy.get('.user-info').should('be.visible').contains('Signed in as testuser');
    cy.get('.login-overlay').should('not.exist');
  });



});
