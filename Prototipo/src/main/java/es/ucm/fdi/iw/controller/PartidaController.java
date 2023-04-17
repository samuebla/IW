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

        return "partida";
    }

	private Jugador jugadorBasura(long id) {
        Jugador j = new Jugador();
        j.setUser(entityManager.find(User.class, id));
        return j;
    }

    @Transactional
    @PostMapping("")
    public String nuevaPartida(Model model, HttpSession session) {
        User u = entityManager.find(User.class, ((User) session.getAttribute("u")).getId());

        model.addAttribute("user", u);

        Partida p = new Partida();
        p.setCurrentState(Partida.State.Lobby);

        Jugador j = new Jugador();
        j.setUser(u);
        p.getJugadores().add(j);
        p.getJugadores().add(jugadorBasura(3));
        // p.getJugadores().add(jugadorBasura(4));
        // p.getJugadores().add(jugadorBasura(5));
        for (Jugador o : p.getJugadores())
            entityManager.persist(o);
        entityManager.persist(p);
        entityManager.flush(); // sólo necesario porque queremos que el ID se genere antes de ir a la vista

        model.addAttribute("partida", p);
        model.addAttribute("jefe", u.getId() == p.getJugadores().get(0).getUser().getId());
        model.addAttribute("messages", p.getReceived());

        return "partida";
    } // normalmente, el flush se haría (automáticamente) aquí, al acabarse la
    // transición

	@Transactional
	@PostMapping("/{id}")
	public String setPartida(@PathVariable long id, Model model, HttpSession session, @RequestParam int tiempoTotal) {
		User u = entityManager.find(User.class, ((User) session.getAttribute("u")).getId());
		Partida p = entityManager.find(Partida.class, id);
  
		model.addAttribute("partida", p);
		model.addAttribute("user", u);
		// model.addAttribute("jugadores", p.getJugadores());
  
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
        // model.addAttribute("jugadores", p.getJugadores());

        model.addAttribute("jefe", u.getId() == p.getJugadores().get(0).getUser().getId());

        System.out.println("HOLA ESTOY AKKA");
        Message newMsg = new Message();
        newMsg.setText(text.get("message").asText()); // {message: "patata"}
        newMsg.setPartida(p);
        newMsg.setSender(u);
        System.out.println("HOLA ESTOY AKKA x2");

        p.getReceived().add(newMsg);
        entityManager.persist(newMsg);
        entityManager.persist(p);
        entityManager.flush();
        
        model.addAttribute("messages", p.getReceived());

        //Meterlo en un topic
        //Suscribirse al canal
        //messagingTemplate.convertAndSend("/user/" + u.getUsername() + "/queue/updates", json);

        System.out.println("HOLA ESTOY AKKA x3");
        //CAMBIAR
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
            p.getJugadores().add(j);
            entityManager.persist(j);
            entityManager.persist(p);
            entityManager.flush(); // sólo necesario porque queremos que el ID se genere antes de ir a la vista
        }

        // model.addAttribute("jugadores", p.getJugadores());

        model.addAttribute("jefe", u.getId() == p.getJugadores().get(0).getUser().getId());

        // if (u.getId() == p.getJugadores().get(0).getUser().getId()) {
        // // soy el jefe!
        // p.setTiempoTotal(tiempoTotal);
        // }

        model.addAttribute("messages", p.getReceived());

        return "partida";
    }

	@Transactional
    @PostMapping("/{id}/reportar")
    public String reportUser(@PathVariable long id, Model model, HttpSession session, @RequestParam long id_denunciado,
            @RequestParam long id_denunciante) {
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
        if (id_denunciado != id_denunciante) {
            // Reportar al usuario indicado
            User reportedUser = entityManager.find(User.class, id_denunciado);
            User reportingUser = entityManager.find(User.class, id_denunciante);
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
}
