package es.ucm.fdi.iw.g02.demo.control;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RootController {
    @GetMapping("nombre")

    //instancia index.html en 
    //resources/templates
    String diHola(Model model) {

        model.addAttribute("nombre", "Venancio");
        
        return "index";
    }
}
