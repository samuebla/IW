package es.ucm.fdi.iw.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Site administration.
 *
 * Access to this end-point is authenticated - see SecurityConfig
 */
@Controller
@RequestMapping("admin")
public class AdminController {

    private static final Logger log = LogManager.getLogger(AdminController.class);

    @GetMapping("/administrar")
    public String administrar(Model model) {
        return "administrar";
    }

    @GetMapping("/listausuarios")
    public String listausuarios(Model model) {
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
