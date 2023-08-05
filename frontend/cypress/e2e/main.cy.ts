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

  // If you have a way to programmatically log in, you can write a test to verify the logged-in state
  // it('should display user info when logged in', () => {
  //   // Assuming the user is initially logged out and needs to log in
  //   cy.get('.login-overlay').should('be.visible');
  //   cy.get('app-login').should('be.visible');

  //   // Enter username and password
  //   cy.get('input#username').type('testuser');
  //   cy.get('input#password').type('testpassword');

  //   // Click login button
  //   cy.get('button[type=submit]').click();

  //   // Wait for login to complete
  //   cy.get('.user-info').should('be.visible').contains('Signed in as');
  //   cy.get('.login-overlay').should('not.exist');
  // });
  it('should display user info when logged in', () => {
    // Send a POST request to log in
    cy.request({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/login/',
      body: {
        username: 'testuser',
        password: 'testpassword',
      },
    }).then((response) => {
      // Get the token from the response and set it in local storage
      const token = response.body.token;
      localStorage.setItem('authToken', token);
      if (response.body.username) {
        localStorage.setItem('username', response.body.username);
      }
    });

    // Visit the main page or the URL where the user should be redirected after login
    cy.visit('');

    // Check that user info is displayed now that the user is logged in
    cy.get('.user-info').should('be.visible').contains('Signed in as');
    cy.get('.login-overlay').should('not.exist');
  });

});
