package es.ucm.fdi.iw.controller;

import javax.servlet.http.HttpSession;

import javax.persistence.EntityManager;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import es.ucm.fdi.iw.model.User;

/**
 * Non-authenticated requests only.
 */
@Controller
public class RootController {

    private static final Logger log = LogManager.getLogger(RootController.class);

	@Autowired
	private EntityManager entityManager;

    @GetMapping("/partida")
    public String partida(Model model) {
        return "partida";
    }

    @GetMapping("/lobby")
    public String lobby(Model model) {
        return "lobby";
    }

    @GetMapping("/probarlobbys")
    public String probarlobbys(Model model) {
        return "probarlobbys";
    }

    @GetMapping("/login")
    public String login(Model model) {
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

    @GetMapping("/api/register")
    public String register(Model model) {
        return "register";
    }

    @GetMapping("/")
    public String index(Model model, HttpSession session) {
        User u = (User)session.getAttribute("u");
        if (u != null) {
            u = entityManager.find(User.class, u.getId());
            log.info("El usuario ha jugado {} partidas", u.getHistorial().size());
            model.addAttribute("jugadas", u.getHistorial().size());
        }
        return "index";
    }
}
