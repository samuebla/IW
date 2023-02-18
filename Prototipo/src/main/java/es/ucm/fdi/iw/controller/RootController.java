package es.ucm.fdi.iw.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Non-authenticated requests only.
 */
@Controller
public class RootController {

    private static final Logger log = LogManager.getLogger(RootController.class);

    @GetMapping("/login")
    public String login(Model model) {
        return "login";
    }

    @GetMapping("/comojugar")
    public String comojugar(Model model) {
        return "comojugar";
    }

    @GetMapping("/records")
    public String records(Model model) {
        return "records";
    }

    @GetMapping("/")
    public String index(Model model) {
        return "index";
    }
}
