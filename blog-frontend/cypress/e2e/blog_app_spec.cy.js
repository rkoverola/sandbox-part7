describe('Blog app', function() {

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', () => {
    cy.contains('Username')
    cy.contains('Password')
    cy.contains('Login')
  })

  describe('Login', function() {
    beforeEach(function() {
      const user = {
        username: 'jrest',
        password: 'restisbest',
        name: 'Juha REST'
      }
      cy.createUser(user)
      cy.visit('http://localhost:3000')
    })

    it('succeeds with correct credentials', function() {
      cy.get('[data-cy="username"]').type('jrest')
      cy.get('[data-cy="password"]').type('restisbest')
      cy.contains('Login').click()
      cy.contains('Juha REST is logged in')
    })

    it('fails with incorrect credentials', function() {
      cy.get('[data-cy="username"]').type('jrest')
      cy.get('[data-cy="password"]').type('restsucks')
      cy.contains('Login').click()
      cy.contains('Invalid username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      const user = {
        username: 'jrest',
        password: 'restisbest',
        name: 'Juha REST'
      }
      cy.createUser(user)
      cy.login({ username: 'jrest', password: 'restisbest' })
      cy.visit('http://localhost:3000')
    })
    it('a valid blog can be created', function() {
      cy.get('.titleInput').type('Cypress says hello')
      cy.get('.authorInput').type('Cypress')
      cy.get('.urlInput').type('no')
      cy.get('.submitButton').click()
      cy.contains('Blog creation successful')
      cy.contains('Cypress says hello')
    })
    it('invalid blog creation fails', function() {
      cy.get('.authorInput').type('Dumbass')
      cy.get('.urlInput').type('no')
      cy.get('.submitButton').click()
      cy.contains('Blog creation failed')
      cy.get('html').should('not.contain', 'Dumbass')
    })
    describe('and there are existing blogs', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'first blog', author:'some author', url: 'no', likes: 1 })
        cy.createBlog({ title: 'second blog', author:'some author', url: 'no', likes: 2 })
        cy.createBlog({ title: 'third blog', author:'other author', url: 'no', likes: 3 })
        cy.visit('http://localhost:3000')
      })
      it('they can be liked', function() {
        cy.contains('first blog').find('.toggleMinimizedButton').click()
        cy.contains('first blog').parent().find('.additionalBlogInfo').as('firstBlogInfo')
        cy.get('@firstBlogInfo').contains('Likes: 1')
        cy.get('@firstBlogInfo').find('.likeButton').click()
        cy.get('@firstBlogInfo').contains('Likes: 2')
      })
      it('they can be deleted', function() {
        cy.contains('first blog').find('.toggleMinimizedButton').click()
        cy.contains('first blog').parent().find('.additionalBlogInfo').find('.removeButton').click()
        cy.contains('Blog removed successfully')
        cy.get('html').should('not.contain', 'first blog')
      })
      it.only('they should be ordered by amount of likes', function() {
        cy.get('table>tr').eq(0).as('firstElement')
        cy.get('@firstElement').contains('Likes: 3')
        cy.get('@firstElement').contains('third blog')

        cy.contains('second blog').find('.toggleMinimizedButton').click()
        cy.contains('second blog').parent().find('.additionalBlogInfo').find('.likeButton').click()
        cy.contains('second blog').parent().find('.additionalBlogInfo').find('.likeButton').click()

        cy.get('table>tr').eq(0).as('newFirstElement')
        cy.get('@newFirstElement').contains('Likes: 4')
        cy.get('@newFirstElement').contains('second blog')

        cy.get('table>tr').eq(1).as('newSecondElement')
        cy.get('@newSecondElement').contains('Likes: 3')
        cy.get('@newSecondElement').contains('third blog')
      })
    })
  })
})