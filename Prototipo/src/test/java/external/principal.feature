Feature: usuario inicia sesion crea un lobby se sale y otro entra

Scenario: Login, Create Lobby, Logout, Login with Different User
  #Login con b
  Given call read('login.feature@login_b')
  And driver baseUrl
  When submit().click("{button}Lobbyes")
  Then waitForUrl(baseUrl + '/probarlobbys')
  When submit().click("{button}Crear partida 1")
  Then waitForUrl(baseUrl + '/lobby')
  When submit().click("{button}logout")
  Then waitForUrl(baseUrl + '/login')
  Given call read('login.feature@login_c')
  And driver baseUrl
  When submit().click("{button}Lobbyes")
  Then waitForUrl(baseUrl + '/probarlobbys')
  When submit().click("{button}Crear partida 1")
  Then waitForUrl(baseUrl + '/lobby')