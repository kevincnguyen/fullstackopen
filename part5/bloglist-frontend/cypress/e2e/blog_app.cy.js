describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user1 = {
      username: 'jjon',
      name: 'Joe Johnson',
      password: 'idontknow'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user1)
    const user2 = {
      'username': 'sppider',
      'name': 'Peter Parker',
      'password': 'iamspiderman'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('input[name=Username]').type('jjon')
      cy.get('input[name=Password]').type('idontknow')
      cy.get('#login-button').click()

      cy.contains('blogs')
      cy.contains('Joe Johnson logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('input[name=Username]').type('jjon')
      cy.get('input[name=Username]').type('thewrongpassword')
      cy.get('#login-button').click()

      cy.contains('log in to application')
      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
      cy.get('html').should('not.contain', 'Joe Johnson logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('input[name=Username]').type('jjon')
      cy.get('input[name=Password]').type('idontknow')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      // ensure that a new blog is added to the list of all blogs.
      cy.contains('new blog').click()
      cy.get('input[name=Title]').type('Chicken Wings')
      cy.get('input[name=Author]').type('Chicken Little')
      cy.get('input[name=Url]').type('www.wingstop.com')
      cy.get('#create-button').click()

      cy.contains('Chicken Wings Chicken Little')
      cy.contains('view')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.contains('new blog').click()
        cy.get('input[name=Title]').type('Chicken Wings')
        cy.get('input[name=Author]').type('Chicken Little')
        cy.get('input[name=Url]').type('www.wingstop.com')
        cy.get('#create-button').click()
      })

      it('user can like a blog', function () {
        cy.contains('Chicken Wings Chicken Little')
          .parent()
          .get('#view-button')
          .click()

        cy.contains('likes 0')
          .parent()
          .get('#like-button')
          .click()

        cy.contains('likes 1')
      })

      it('user can delete their blog', function () {
        cy.contains('Chicken Wings Chicken Little')
          .parent()
          .get('#view-button')
          .click()
        cy.contains('remove').click()
        cy.contains('Chicken Wings Chicken Little').should('not.exist')
      })

      it('only the creator can see the delete button of a blog', function () {
        cy.contains('Chicken Wings Chicken Little')
          .parent()
          .get('#view-button')
          .click()
        cy.contains('remove')

        cy.contains('logout').click()

        cy.get('input[name=Username]').type('sppider')
        cy.get('input[name=Password]').type('iamspiderman')
        cy.get('#login-button').click()
        cy.contains('Peter Parker logged in')

        cy.contains('Chicken Wings Chicken Little')
          .parent()
          .get('#view-button')
          .click()
        cy.contains('remove').should('not.exist')
      })
    })

    describe('and multiple blogs exists', function () {
      beforeEach(function () {
        cy.get('button[id=\'new blog\']').click()
        cy.get('input[name=Title]').type('First')
        cy.get('input[name=Author]').type('Chicken Little')
        cy.get('input[name=Url]').type('www.wingstop.com')
        cy.get('#create-button').click()

        cy.get('button[id=\'new blog\']').click()
        cy.get('input[name=Title]').type('Second')
        cy.get('input[name=Author]').type('Ronald')
        cy.get('input[name=Url]').type('www.mcdonalds.com')
        cy.get('#create-button').click()

        cy.get('button[id=\'new blog\']').click()
        cy.get('input[name=Title]').type('Third')
        cy.get('input[name=Author]').type('Luigi')
        cy.get('input[name=Url]').type('www.pizzahut.com')
        cy.get('#create-button').click()
      })

      it.only('blogs are ordered descending according to likes', function() {
        cy.contains('First Chicken Little')
          .parent()
          .find('#view-button')
          .click()

        cy.contains('likes 0')
          .parent()
          .find('#like-button')
          .click()

        cy.contains('likes 1')
          .parent()
          .find('#like-button')
          .click()

        cy.get('#hide-button').click()

        cy.contains('Second Ronald')
          .parent()
          .find('#view-button')
          .click()

        cy.contains('likes 0')
          .parent()
          .find('#like-button')
          .click()

        cy.get('.blog').eq(0).should('contain', 'First')
        cy.get('.blog').eq(1).should('contain', 'Second')
        cy.get('.blog').eq(2).should('contain', 'Third')
      })
    })
  })
})

