package es.ucm.fdi.iw.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

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

        Partida p = new Partida();
        p.setCurrentState(Partida.State.Lobby);

        Jugador j = new Jugador();
        j.setUser(u);
        p.getJugadores().add(j);
        p.getJugadores().add(jugadorBasura(3));
        p.getJugadores().add(jugadorBasura(4));
        p.getJugadores().add(jugadorBasura(5));
        for (Jugador o : p.getJugadores()) entityManager.persist(o);
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
        //model.addAttribute("jugadores", p.getJugadores());

        model.addAttribute("jefe", u.getId() == p.getJugadores().get(0).getUser().getId());

        if (u.getId() == p.getJugadores().get(0).getUser().getId()) {
            // soy el jefe!
            p.setTiempoTotal(tiempoTotal);
        }

        model.addAttribute("messages", p.getReceived());

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
