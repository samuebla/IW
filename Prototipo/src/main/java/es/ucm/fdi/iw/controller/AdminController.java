package es.ucm.fdi.iw.controller;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import es.ucm.fdi.iw.model.User;

/**
 * Site administration.
 *
 * Access to this end-point is authenticated - see SecurityConfig
 */
@Controller
@RequestMapping("admin")
public class AdminController {

    private static final Logger log = LogManager.getLogger(AdminController.class);

    @Autowired
    private EntityManager entityManager;

    @GetMapping("/administrar")
    public String administrar(Model model) {
        return "administrar";
    }

    @GetMapping("/listausuarios")
    public String listausuarios(Model model) {

        model.addAttribute("usuarios", entityManager.createQuery("SELECT u FROM User u").getResultList());
        return "listausuarios";
    }

    @GetMapping("/perfilusuariox")
    public String perfilusuariox(Model model) {
        return "perfilusuariox";
    }

    @GetMapping("/")
    public String index(Model model) {
        return "index";
    }
}
