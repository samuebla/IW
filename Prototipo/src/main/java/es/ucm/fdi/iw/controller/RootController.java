package es.ucm.fdi.iw.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import java.util.List;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;

import es.ucm.fdi.iw.model.Denuncia;
import es.ucm.fdi.iw.model.Jugador;
import es.ucm.fdi.iw.model.Message;
import es.ucm.fdi.iw.model.Partida;
import es.ucm.fdi.iw.model.User;

/**
 * Non-authenticated requests only.
 */
@Controller
public class RootController {

    private static final Logger log = LogManager.getLogger(RootController.class);

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/partida/{id}")
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
    @PostMapping("/partida")
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
    @PostMapping("/partida/{id}")
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
    @PostMapping("/partida/{id}/mensaje")
    public String sendMessage(@PathVariable long id, Model model, HttpSession session, @RequestParam String text) {
        User u = entityManager.find(User.class, ((User) session.getAttribute("u")).getId());
        Partida p = entityManager.find(Partida.class, id);

        model.addAttribute("partida", p);
        model.addAttribute("user", u);
        // model.addAttribute("jugadores", p.getJugadores());

        model.addAttribute("jefe", u.getId() == p.getJugadores().get(0).getUser().getId());

        Message newMsg = new Message();
        newMsg.setText(text);
        newMsg.setPartida(p);
        newMsg.setSender(u);
    
        p.getReceived().add(newMsg);
        entityManager.persist(newMsg);
        entityManager.persist(p);
        entityManager.flush();
        
        model.addAttribute("messages", p.getReceived());

        return "partida";
    }

    @Transactional
    @PostMapping("/partida/{id}/newuser")
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
    @PostMapping("/partida/{id}/reportar")
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

    @GetMapping("/lobby")
    public String lobby(Model model) {
        return "lobby";
    }

    @GetMapping("/probarlobbys")
    public String probarlobbys(Model model) {
        model.addAttribute("partidas",
                entityManager.createQuery("select p from Partida p").getResultList());
        model.addAttribute("fullLobby", false);

        return "probarlobbys";
    }

    @GetMapping("/login")
    public String login(Model model, @RequestParam(required = false) String op) {
        // success is true if we are coming in from correctly registering
        model.addAttribute("success", "success".equals(op));
        log.info("at login, success={} op is {}", "success".equals(op), op);
        return "login";
    }

    @GetMapping("/comojugar")
    public String comojugar(Model model) {
        return "comojugar";
    }

    @GetMapping("/api/records")
    public String records(Model model) {
        return "records";
    }

    @GetMapping("/register")
    public String goToRegister(Model model) {
        return "register";
    }

    @Transactional
    @PostMapping("/register")
    public RedirectView registerNewUser(Model model, @RequestParam String username, @RequestParam String password,
            final RedirectAttributes redirectAttributes) {
        User target = new User();
        target.setUsername(username);
        target.setRoles("USER");
        target.setPassword(passwordEncoder.encode(password));
        target.setEnabled(true);
        entityManager.persist(target);
        entityManager.flush(); // forces DB to add user & assign valid id

        // si respondo "login?op=success", dice que no encuentra una vista llamada
        // login?op=success.html
        redirectAttributes.addAttribute("op", "success");
        return new RedirectView("login");
    }

    @GetMapping("/")
    public String index(Model model, HttpSession session) {
        User u = (User) session.getAttribute("u");
        if (u != null) {
            u = entityManager.find(User.class, u.getId());
            log.info("El usuario ha jugado {} partidas", u.getHistorial().size());
            model.addAttribute("jugadas", u.getHistorial().size());
        }
        return "index";
    }
}
