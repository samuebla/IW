package es.ucm.fdi.iw.controller;

import es.ucm.fdi.iw.LocalData;
import es.ucm.fdi.iw.model.Message;
import es.ucm.fdi.iw.model.Transferable;
import es.ucm.fdi.iw.model.User;
import es.ucm.fdi.iw.model.User.Role;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import javax.persistence.EntityManager;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.transaction.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.io.*;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import es.ucm.fdi.iw.model.Denuncia;
import es.ucm.fdi.iw.model.Jugador;
import es.ucm.fdi.iw.model.Message;
import es.ucm.fdi.iw.model.Partida;
import es.ucm.fdi.iw.model.User;

/**
 * Partida management.
 *
 * Access to this end-point is authenticated.
 */
@Controller
@RequestMapping("partida") // todas las urls de abajo empiezan por "partida"
public class PartidaController {

    public static class GameStructure {
        public String type;
        public int pieceType;
        public int pieceTeam;
        public int oldPositionX;
        public int oldPositionY;
        public int newPositionX;
        public int newPositionY;
        public int newTurn;

        public GameStructure(String typeAux, int pieceTypeAux, int pieceTeamAux, int oldPositionXAux,
                int oldPositionYAux, int newPositionXAux, int newPositionYAux, int newTurnAux) {
            type = typeAux;
            pieceType = pieceTypeAux;
            pieceTeam = pieceTeamAux;
            oldPositionX = oldPositionXAux;
            oldPositionY = oldPositionYAux;
            newPositionX = newPositionXAux;
            newPositionY = newPositionYAux;
            newTurn = newTurnAux;
        }
    }

    public static class ResetTableroStructure {
        public String type;
        public String tableroType;
        public String tableroTeam;

        public ResetTableroStructure(String typeAux, String tableroTypeAux, String tableroTeamAux) {
            type = typeAux;
            tableroType = tableroTypeAux;
            tableroTeam = tableroTeamAux;
        }
    }

    public static class ReadyStructure {
        public String type;
        public String username;
        public long userId;
        public long partidaId;
        public boolean ready;
        public boolean startGame;

        public ReadyStructure(String typeAux, String usernameAux, long playerIdAux, long partidaIdAux, boolean readyAux,
                boolean startGameAux) {
            type = typeAux;
            username = usernameAux;
            userId = playerIdAux;
            partidaId = partidaIdAux;
            ready = readyAux;
            startGame = startGameAux;
        }
    }

    public static class FinalStructure {
        public String type;
        public long userId;

        public FinalStructure(String typeAux, long playerIdAux) {
            type = typeAux;
            userId = playerIdAux;
        }
    }

    private static final Logger log = LogManager.getLogger(PartidaController.class);

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private LocalData localData;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Exception to use when denying access to unauthorized users.
     * 
     * In general, admins are always authorized, but users cannot modify
     * each other's profiles.
     */
    @ResponseStatus(value = HttpStatus.FORBIDDEN, reason = "Inicia sesión antes de jugar") // 403
    public static class NoPuedesJugarException extends RuntimeException {
    }

    /**
     * Landing page for a partida page
     */
    @GetMapping("/{id}")
    public String partida(@PathVariable long id, Model model, HttpSession session) {
        Partida p = entityManager.find(Partida.class, id);
        model.addAttribute("partida", p);
        User u = entityManager.find(User.class, ((User) session.getAttribute("u")).getId());
        model.addAttribute("jefe", u.getId() == p.getJugadores().get(0).getUser().getId());
        model.addAttribute("user", u);
        model.addAttribute("messages", p.getReceived());

        model.addAttribute("jugadores", p.getJugadores());

        // TODO Cambiar false al jugador en cuestión
        // ReadyStructure readyObject = new ReadyStructure("JOIN", u.getUsername(),
        // u.getId(), p.getId(), false);

        // // Meterlo en un topic
        // // Suscribirse al canal <-- esto lo hace el cliente, no el controlador
        // ObjectMapper om = new ObjectMapper();
        // try {
        // messagingTemplate.convertAndSend("/topic/" + p.getTopicId(),
        // om.writeValueAsString(readyObject));
        // } catch (JsonProcessingException jpe) {
        // log.warn("Error enviando ReadyStructure!", jpe);
        // }

        return "partida";
    }

    @Transactional
    @PostMapping("")
    public String nuevaPartida(Model model, HttpSession session) {
        User u = entityManager.find(User.class, ((User) session.getAttribute("u")).getId());

        model.addAttribute("user", u);

        Partida p = new Partida();
        p.setCurrentState(0);
        p.setTopicId(UserController.generateRandomBase64Token(6));

        p.setGameStarted(false);

        p.setTurn(0);

        char[] teams = new char[14 * 14];
        char[] types = new char[14 * 14];

        // Rellenamos todo el tablero a vacío
        for (int i = 0; i < 14 * 14; ++i) {
            teams[i] = 'e';
            types[i] = 'e';

        }

        for (int i = 0; i < 8; ++i) {
            /// Equipo blanco ///
            // Peones
            teams[(14 * 12 + (i + 3))] = '0';
            types[(14 * 12 + (i + 3))] = (char) ('f' + i);
            // Otras piezas
            teams[(14 * 13 + (i + 3))] = '0';
            types[(14 * 13 + (i + 3))] = (char) ('f' + i + 8);

            /// Equipo rojo ///
            // Peones
            teams[((14 * (i + 3)) + 1)] = '1';
            types[((14 * (i + 3)) + 1)] = (char) ('f' + i);
            // Otras piezas
            teams[(14 * (i + 3))] = '1';
            types[(14 * (i + 3))] = (char) ('f' + i + 8);

            /// Equipo negro ///
            // Peones
            teams[(14 + (i + 3))] = '2';
            types[(14 + (i + 3))] = (char) ('f' + i);
            // Otras piezas
            teams[(i + 3)] = '2';
            types[(i + 3)] = (char) ('f' + i + 8);

            /// Equipo azul ///
            // Peones
            teams[((14 * (i + 3)) + 12)] = '3';
            types[((14 * (i + 3)) + 12)] = (char) ('f' + i);
            // Otras piezas
            teams[((14 * (i + 3)) + 13)] = '3';
            types[((14 * (i + 3)) + 13)] = (char) ('f' + i + 8);
        }

        p.setTableroTeams(new String(teams));
        p.setTableroTypes(new String(types));

        Jugador j = new Jugador();
        j.setUser(u);
        // Jugador inicial, team 0
        j.setTeam('0');
        j.setContadorFiguras(16);
        j.setPiezasComidas(0);
        p.getJugadores().add(j);
        p.setIdCurrentPlayerTurn(j.getId());
        entityManager.persist(j);
        entityManager.persist(p);
        entityManager.flush(); // sólo necesario porque queremos que el ID se genere antes de ir a la vista

        model.addAttribute("partida", p);
        model.addAttribute("jefe", u.getId() == p.getJugadores().get(0).getUser().getId());
        model.addAttribute("messages", p.getReceived());

        model.addAttribute("jugadores", p.getJugadores());

        // ReadyStructure readyObject = new ReadyStructure("JOIN", u.getUsername(),
        // u.getId(), p.getId(), false);

        // // Meterlo en un topic
        // // Suscribirse al canal <-- esto lo hace el cliente, no el controlador
        // ObjectMapper om = new ObjectMapper();

        // try {
        // String newUserInformation = om.writeValueAsString(readyObject);
        // model.addAttribute("newUserInformation", newUserInformation);
        // } catch (JsonProcessingException jpe) {
        // log.warn("Error enviando ReadyStructure!", jpe);
        // }

        return "partidaNueva";
    } // normalmente, el flush se haría (automáticamente) aquí, al acabarse la
      // transición

    @Transactional
    @PostMapping("/{id}")
    public String setPartida(@PathVariable long id, Model model, HttpSession session, @RequestParam int tiempoTotal) {
        User u = entityManager.find(User.class, ((User) session.getAttribute("u")).getId());
        Partida p = entityManager.find(Partida.class, id);

        model.addAttribute("partida", p);
        model.addAttribute("user", u);
        model.addAttribute("jugadores", p.getJugadores());

        model.addAttribute("jefe", u.getId() == p.getJugadores().get(0).getUser().getId());

        if (u.getId() == p.getJugadores().get(0).getUser().getId()) {
            // soy el jefe!
            p.setTiempoTotal(tiempoTotal);
        }

        model.addAttribute("messages", p.getReceived());

        return "partida";
    }

    @Transactional
    @PostMapping("/{id}/mensaje")
    @ResponseBody
    public String sendMessage(@PathVariable long id, Model model, HttpSession session, @RequestBody JsonNode text) {
        User u = entityManager.find(User.class, ((User) session.getAttribute("u")).getId());
        Partida p = entityManager.find(Partida.class, id);

        model.addAttribute("partida", p);
        model.addAttribute("user", u);
        model.addAttribute("jugadores", p.getJugadores());

        model.addAttribute("jefe", u.getId() == p.getJugadores().get(0).getUser().getId());

        Message newMsg = new Message();
        newMsg.setText(text.get("message").asText()); // {message: "patata"}
        newMsg.setPartida(p);
        newMsg.setSender(u);
        newMsg.setDateSent(LocalDateTime.now());
        log.info("Recibido mensaje {} de {}", newMsg.getText(), newMsg.getSender().getUsername());

        p.getReceived().add(newMsg);
        entityManager.persist(newMsg);
        entityManager.persist(p);
        entityManager.flush();

        model.addAttribute("messages", p.getReceived());

        // Meterlo en un topic
        // Suscribirse al canal <-- esto lo hace el cliente, no el controlador
        ObjectMapper om = new ObjectMapper();
        try {
            messagingTemplate.convertAndSend("/topic/" + p.getTopicId(), om.writeValueAsString(newMsg.toTransfer()));
        } catch (JsonProcessingException jpe) {
            throw new RuntimeException("Error enviando mensaje!", jpe);
        }

        return "{}";
    }

    @Transactional
    @PostMapping("/{id}/listo")
    @ResponseBody
    public String listo(@PathVariable long id, Model model, HttpSession session) {
        User u = entityManager.find(User.class, ((User) session.getAttribute("u")).getId());
        Partida p = entityManager.find(Partida.class, id);

        model.addAttribute("partida", p);
        model.addAttribute("user", u);
        model.addAttribute("jugadores", p.getJugadores());

        model.addAttribute("jefe", u.getId() == p.getJugadores().get(0).getUser().getId());

        boolean startGame = false;

        long playerId = 0;
        boolean ready = false;

        int numPlayersReady = 0;
        for (Jugador j : p.getJugadores()) {
            if (j.getUser().getId() == u.getId()) {
                j.setReady(!j.isReady());

                // Asignamos los valores para el ObjectMapping
                playerId = j.getId();
                ready = j.isReady();

                if (j.isReady()) {
                    numPlayersReady++;
                }
            } else if (j.isReady()) {
                numPlayersReady++;
            }
        }

        if ((numPlayersReady == 4) && (p.getCurrentState() == 0)) {
            System.out.print("Empiezo");
            p.setCurrentState(1);
            // Comenzamos la partida
            startGame = true;
        }

        System.out.print("Num jugadores" + numPlayersReady);

        entityManager.persist(p);
        entityManager.flush();

        /*
         * 
         * Mapa java -> { clave1: valor1 }
         * Array/Lista java [ uno, dos, ]
         * booleano, string, int/long/double=>number
         * 
         * {
         * unaClave: true,
         * otraClave: 42
         * }
         * 
         * private static class BooleanoYEntero {
         * public boolean unaClave;
         * public int otraClave;
         * }
         * 
         * ObjectMapper om = new ObjectMapper();
         * om.serializa(new BooleanoYEntero(true, 42));
         * 
         * 
         */

        ReadyStructure readyObject = new ReadyStructure("JOIN", u.getUsername(), u.getId(), p.getId(), ready,
                startGame);

        // Meterlo en un topic
        // Suscribirse al canal <-- esto lo hace el cliente, no el controlador
        ObjectMapper om = new ObjectMapper();
        try {
            messagingTemplate.convertAndSend("/topic/" + p.getTopicId(), om.writeValueAsString(readyObject));
        } catch (JsonProcessingException jpe) {
            log.warn("Error enviando ReadyStructure!", jpe);
        }

        model.addAttribute("messages", p.getReceived());

        // Meterlo en un topic
        // Suscribirse al canal
        // messagingTemplate.convertAndSend("/user/" + u.getUsername() +
        // "/queue/updates", json);

        // CAMBIAR
        return "{}";
    }

    @Transactional
    @PostMapping("/{id}/newuser")
    public String newUserToLobby(@PathVariable long id, Model model, HttpSession session) {
        User u = entityManager.find(User.class, ((User) session.getAttribute("u")).getId());
        Partida p = entityManager.find(Partida.class, id);

        model.addAttribute("user", u);
        model.addAttribute("partida", p);
        model.addAttribute("numPlayers", p.getJugadores().size());

        boolean ingame = false;

        // Comprobamos si el usuario ya estaba dentro del lobby
        for (Jugador o : p.getJugadores())
            if (o.getUser().getId() == u.getId())
                ingame = true;

        // Si el lobby está lleno y yo no participo...
        if (ingame == false && p.getJugadores().size() == 4) {
            // No puede unirse a la partida
            model.addAttribute("partidas",
                    entityManager.createQuery("select p from Partida p").getResultList());
            model.addAttribute("fullLobby", true);
            // Y te hecha a los lobbies
            return "probarlobbys";
        }
        // Si no estas dentro pero hay espacio...
        else if (ingame == false) {
            // Te añade a la partida
            Jugador j = new Jugador();
            j.setUser(u);
            j.setTeam((char) (p.getJugadores().size() + 48)); // 48 is 0 in ASCI
            j.setContadorFiguras(16);
            j.setPiezasComidas(0);

            p.getJugadores().add(j);
            entityManager.persist(j);
            entityManager.persist(p);
            entityManager.flush(); // sólo necesario porque queremos que el ID se genere antes de ir a la vista
        }

        model.addAttribute("jugadores", p.getJugadores());

        model.addAttribute("jefe", u.getId() == p.getJugadores().get(0).getUser().getId());

        // if (u.getId() == p.getJugadores().get(0).getUser().getId()) {
        // // soy el jefe!
        // p.setTiempoTotal(tiempoTotal);
        // }

        ReadyStructure readyObject = new ReadyStructure("JOIN", u.getUsername(), u.getId(), p.getId(), false, false);

        // Meterlo en un topic
        // Suscribirse al canal <-- esto lo hace el cliente, no el controlador
        ObjectMapper om = new ObjectMapper();
        try {
            messagingTemplate.convertAndSend("/topic/" + p.getTopicId(), om.writeValueAsString(readyObject));
        } catch (JsonProcessingException jpe) {
            log.warn("Error enviando ReadyStructure!", jpe);
        }

        model.addAttribute("messages", p.getReceived());

        return "partidaNueva";
    }

    @Transactional
    @PostMapping("/{id}/reportar")
    public String reportUser(@PathVariable long id, Model model, HttpSession session, @RequestParam long idDenunciado,
            @RequestParam long idDenunciante) {
        User u = entityManager.find(User.class, ((User) session.getAttribute("u")).getId());
        Partida p = entityManager.find(Partida.class, id);
        model.addAttribute("jefe", u.getId() == p.getJugadores().get(0).getUser().getId());

        model.addAttribute("user", u);
        model.addAttribute("partida", p);
        model.addAttribute("jugadores", p.getJugadores());

        // if (u.getId() == p.getJugadores().get(0).getUser().getId()) {
        // // soy el jefe!
        // p.setTiempoTotal(tiempoTotal);
        // }

        model.addAttribute("messages", p.getReceived());

        // Para evitar que no te denuncies a ti mismo?
        if (idDenunciado != idDenunciante) {
            // Reportar al usuario indicado
            User reportedUser = entityManager.find(User.class, idDenunciado);
            User reportingUser = entityManager.find(User.class, idDenunciante);
            Denuncia newDenuncia = new Denuncia();
            newDenuncia.setPartida(p);
            newDenuncia.setDenunciado(reportedUser);
            newDenuncia.setDenunciante(reportingUser);
            reportedUser.getDenuncias().add(newDenuncia);

            entityManager.persist(newDenuncia);
            entityManager.flush();
        }

        return "partida";
    }

    @Transactional
    @PostMapping("/{id}/pieceMoved")
    // En el return devuelve lo que ponga en el return directamente
    @ResponseBody
    public String movePiece(@PathVariable long id, Model model, HttpSession session, @RequestBody JsonNode data) {
        String pieceTeam = data.get("pieceTeam").asText();
        int pieceType = data.get("pieceType").asInt();
        int boardX = data.get("boardX").asInt();
        int boardY = data.get("boardY").asInt();
        int newBoardX = data.get("newBoardX").asInt();
        int newBoardY = data.get("newBoardY").asInt();

        User u = entityManager.find(User.class, ((User) session.getAttribute("u")).getId());
        Partida p = entityManager.find(Partida.class, id);

        if (!p.gameStarted) {
            p.setGameStarted(true);
        }

        model.addAttribute("jefe", u.getId() == p.getJugadores().get(0).getUser().getId());

        model.addAttribute("user", u);
        model.addAttribute("partida", p);
        model.addAttribute("jugadores", p.getJugadores());

        model.addAttribute("messages", p.getReceived());

        // Buscamos al usuario que ha hecho la peticion como jugador en la partida
        boolean encontradoJugador = false;
        Jugador jugadorPeticion = null;
        for (Jugador o : p.getJugadores()) {
            if (o.getUser().getId() == u.getId()) {
                encontradoJugador = true;
                jugadorPeticion = o;
            }
        }

        if (encontradoJugador && jugadorPeticion.getTeam() == pieceTeam.charAt(0)) {
            // Comprobamos si hay una pieza ahi
            char teamPreviousPiece = p.tableroTeams.charAt(newBoardY * 14 + newBoardX);
            char typePreviousPiece = p.tableroTypes.charAt(newBoardY * 14 + newBoardX);

            // Si hay alguna pieza de algun equipo...
            // e de Empty
            if (teamPreviousPiece != 'e') {
                boolean playerFound = false;
                int count = 0;

                // Buscamos el jugador de la pieza
                while (count < p.getJugadores().size() && !playerFound) {

                    if (p.getJugadores().get(count).getTeam() == teamPreviousPiece) {

                        // Hemos encontrado al jugador
                        playerFound = true;
                        // Si muere el rey, entonces el jugador pierde
                        if (typePreviousPiece == (char) (12 + 'f')) {
                            p.getJugadores().get(count)
                                    .setContadorFiguras(0);
                            char[] teams = p.tableroTeams.toCharArray();
                            char[] types = p.tableroTypes.toCharArray();

                            for (int i = 0; i < teams.length; ++i) {
                                if (teams[i] == teamPreviousPiece) {
                                    teams[i] = 'e';
                                    types[i] = 'e';
                                }
                            }
                            p.setTableroTeams(new String(teams));
                            p.setTableroTypes(new String(types));

                        } else {
                            p.getJugadores().get(count)
                                    .setContadorFiguras(p.getJugadores().get(count).getContadorFiguras() - 1);
                        }

                        jugadorPeticion.setPiezasComidas(jugadorPeticion.getPiezasComidas() + 1);
                    }
                    System.out.println(p.getJugadores().get(count).getTeam() + " != " + teamPreviousPiece);
                    count++;
                }
            }

            // Movemos la pieza
            char[] teams = p.tableroTeams.toCharArray();
            char[] types = p.tableroTypes.toCharArray();
            // Primero Equipo y luego Tipo
            teams[newBoardY * 14 + newBoardX] = pieceTeam.charAt(0);
            types[newBoardY * 14 + newBoardX] = (char) ('f' + pieceType);

            // Eliminamos la pieza de su antigua posicion
            teams[boardY * 14 + boardX] = 'e';
            types[boardY * 14 + boardX] = 'e';

            // Y reescribimos la base de datos
            p.setTableroTeams(new String(teams));
            p.setTableroTypes(new String(types));

            // Buscamos al siguiente jugador por orden
            p.turn = (int) (pieceTeam.charAt(0)) - 48 + 1;
            boolean foundNextPlayer = false;
            while (p.turn != (int) (pieceTeam.charAt(0)) - 48 && !foundNextPlayer) {
                if (p.turn == 4) {
                    p.turn = 0;
                }
                if (p.getJugadores().get(p.turn).getContadorFiguras() > 0) {
                    foundNextPlayer = true;
                } else {
                    p.turn++;
                }
                foundNextPlayer = true;
            }

            // Cambiamos el turno al siguiente jugador o finalizamos la partida si no hay
            // mas jugadores
            if (foundNextPlayer) {
                p.setIdCurrentPlayerTurn(p.getJugadores().get(p.turn).getId());
            } else {
                p.setCurrentState(2);
            }

            GameStructure readyPiece = new GameStructure("MOVEPIECE", pieceType, (int) (pieceTeam.charAt(0)) - 48,
                    boardX,
                    boardY, newBoardX,
                    newBoardY,
                    p.turn);

            // Meterlo en un topic
            // Suscribirse al canal <-- esto lo hace el cliente, no el controlador
            ObjectMapper om = new ObjectMapper();
            try {
                messagingTemplate.convertAndSend("/topic/" + p.getTopicId(), om.writeValueAsString(readyPiece));
            } catch (JsonProcessingException jpe) {
                log.warn("Error enviando ReadyStructure!", jpe);
            }
        } else {
            System.out.println("No puedo hacer el movimiento");
        }

        return "{}";
    }

    @Transactional
    @PostMapping("/{id}/ganar")
    @ResponseBody
    public String ganarPartida(@PathVariable long id, Model model, HttpSession session) {

        User u = entityManager.find(User.class, ((User) session.getAttribute("u")).getId());
        Partida p = entityManager.find(Partida.class, id);

        FinalStructure endGame = new FinalStructure("FINAL", u.getId());

        // Meterlo en un topic
        // Suscribirse al canal <-- esto lo hace el cliente, no el controlador
        ObjectMapper om = new ObjectMapper();
        try {
            messagingTemplate.convertAndSend("/topic/" + p.getTopicId(), om.writeValueAsString(endGame));
        } catch (JsonProcessingException jpe) {
            log.warn("Error enviando FinalStructure!", jpe);
        }

        return "{}";
    }

}
