# IW
Sergio Baña Marchante
Sam Blázquez Martín
Adriá Carreras Bagur
Miguel Hernández García

La propuesta es la misma que hicimos anteriormente:
Un ajedrez de 4 jugadores multijugador en línea. Los jugadores necesitan iniciar sesión para poder accedes a los distintos lobbys para jugar.
El juego tiene un sistema de mensajes para poder hablar con los otros jugadores y tiene un sistema de denuncias para que el moderador revise los mensajes y les expulse si lo considera oportuno.
El administrador de la página solo es uno y no puede jugar, solo acceder a las denuncias de los usuarios para ver que tipo de mensajes han enviado y poder echarles de la página para que no puedan 
volver a jugar.

El diagrama de la BD está añadido en formato PDF dentro del zip.

Usuarios:

Admin -> a (Contraseña: aa)
Users -> b (Contraseña: aa)
		 c (Contraseña: aa)
		 d (Contraseña: aa)
		 e (Contraseña: aa)
		 f (Contraseña: aa)

Descripción de pruebas:
Como nuestra aplicación es un juego multiplayer no podemos implementar Kárate con mas de 1 terminal, así que hemos realizado la prueba que nos mencionaste en clase de testear el 
inicio de una partida y la unión de los 4 jugadores que consiste en la creación de una partida e ir cerrando e iniciando sesión para que se unan a dicha partida.

Llegamos a la meta propuesta, solo mencionar una cosa que hemos dejado intencionalmente para no dar a confusión
-Si mueres te sale una pantalla de derrota, pero si actualizas la página el juego se sigue reproduciendo solo que estás de espectador (El juego sigue normal y corriente solo que como has muerto no puedes participar)

