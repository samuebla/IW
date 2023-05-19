Feature: Login de 4 usuarios , crecion de partida y logout

Scenario: Login, Create Lobby, Logout
  #Login
  Given call read('login.feature@login_b')
  And driver baseUrl
  And delay(500)
  #Lobbies
  When submit().click("{button}Lobbyes")
  Then waitForUrl(baseUrl + '/probarlobbys')
  And delay(500)
  #Crear lobby
  When submit().click("{button}Crear partida")
  Then waitForUrl(baseUrl + '/partida/1025')
  And delay(500)
  #Darle a listo
  When click("{button}LISTO")
  Then waitForUrl(baseUrl + '/partida/1025')
  And delay(500)
  #Logout
  When submit().click("{button}logout")
  Then waitForUrl(baseUrl + '/login')


  Scenario: Login, Create Lobby, Logout
  #Login
  Given call read('login.feature@login_c')
  And driver baseUrl
  And delay(500)
  #Lobbies
  When submit().click("{button}Lobbyes")
  Then waitForUrl(baseUrl + '/probarlobbys')
  And delay(500)
  #Unirse a lobby
  When submit().click("{button}Jugar")
  Then waitForUrl(baseUrl + '/partida/1025')
  And delay(500)
  #Darle a listo
  When click("{button}LISTO")
  Then waitForUrl(baseUrl + '/partida/1025')
  And delay(500)
  #Logout
  When submit().click("{button}logout")
  Then waitForUrl(baseUrl + '/login')


  Scenario: Login, Create Lobby, Logout
  #Login
  Given call read('login.feature@login_d')
  And driver baseUrl
  And delay(500)
  #Lobbies
  When submit().click("{button}Lobbyes")
  Then waitForUrl(baseUrl + '/probarlobbys')
  And delay(500)
  #Unirse a lobby
  When submit().click("{button}Jugar")
  Then waitForUrl(baseUrl + '/partida/1025')
  And delay(500)
  #Darle a listo
  When click("{button}LISTO")
  Then waitForUrl(baseUrl + '/partida/1025')
  And delay(500)
  #Logout
  When submit().click("{button}logout")
  Then waitForUrl(baseUrl + '/login')


  Scenario: Login, Create Lobby, Logout
  #Login
  Given call read('login.feature@login_e')
  And driver baseUrl
  And delay(500)
  #Lobbies
  When submit().click("{button}Lobbyes")
  Then waitForUrl(baseUrl + '/probarlobbys')
  And delay(500)
  #Unirse a lobby
  When submit().click("{button}Jugar")
  Then waitForUrl(baseUrl + '/partida/1025')
  And delay(500)
  #Darle a listo
  When click("{button}LISTO")
  Then waitForUrl(baseUrl + '/partida/1025')
  And delay(500)
  #Logout
  When submit().click("{button}logout")
  Then waitForUrl(baseUrl + '/login')


