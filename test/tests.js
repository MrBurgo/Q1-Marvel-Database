const expect = chai.expect

describe('setLocalStorage for "favoriteCharacters" object works', () => {
  it('should be a function', () => {
    expect(setCharLocalStorage).to.be.a('function')
  })

  describe('favoriteCharacters in local storage', () => {
    it('should return an object of favorite characters', () => {
      expect(localStorage).to.include.keys('favoriteCharacters')
    })
  })
})

describe('setLocalStorage for "favoriteComics" object works', () => {
  it('should be a function', () => {
    expect(setComicLocalStorage).to.be.a('function')
  })

  describe('favoriteComics in local storage', () => {
    it('should return an object of favorite comics', () => {
      expect(localStorage).to.include.keys('favoriteComics')
    })
  })
})

describe('setLocalStorage for "favoriteEvents" object works', () => {
  it('should be a function', () => {
    expect(setEventLocalStorage).to.be.a('function')
  })

  it('should return an object of favorite events', () => {
    expect(localStorage).to.include.keys('favoriteEvents')
  })
})
