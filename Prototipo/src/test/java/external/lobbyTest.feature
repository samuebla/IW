Feature: usuario inicia sesion crea un lobby se sale y otro entra

#Nena no se que es esto si cuela cuela yo me voy a pegar un tiro

Background:
  * configure systemPropertyKeys = ['karate.env']
  * def baseUrl = 'https://myapp.com'

Scenario: Login, Create Lobby, Logout, Login with Different User
  # Login with first user
  Given url baseUrl + '/login'
  And request { username: 'b', password: 'aa' }
  When method post
  Then status 200
  And match response contains 'Welcome, myusername!'
  And def sessionId = response.cookies.JSESSIONID.value

  # Create lobby
  Given url baseUrl + '/lobby/create'
  And cookie JSESSIONID = sessionId
  And request { name: 'My Lobby' }
  When method post
  Then status 200
  And match response contains 'Lobby created successfully'

  # Logout
  Given url baseUrl + '/logout'
  And cookie JSESSIONID = sessionId
  When method get
  Then status 200
  And match response contains 'You have been logged out'

  # Login with second user
  Given url baseUrl + '/login'
  And request { username: 'a', password: 'aa' }
  When method post
  Then status 200
  And match response contains 'Welcome, otheruser!'
  And def otherSessionId = response.cookies.JSESSIONID.value

  # Verify lobby was created by first user
  Given url baseUrl + '/lobby'
  And cookie JSESSIONID = otherSessionId
  When method get
  Then status 200
  And match response contains 'My Lobby'

  # Logout second user
  Given url baseUrl + '/logout'
  And cookie JSESSIONID = otherSessionId
  When method get
  Then status 200
  And match response contains 'You have been logged out'
