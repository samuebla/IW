package es.ucm.fdi.iw.controller;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.servlet.http.HttpSession;
import javax.transaction.Transactional;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

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
    public String listausuarios(Model model, HttpSession session) {

        model.addAttribute("usuarios", entityManager.createQuery("SELECT u FROM User u").getResultList());

        //Cogemos el usuario
        User u = entityManager.find(User.class, ((User) session.getAttribute("u")).getId());

        //Y lo añadimos al modelo
        model.addAttribute("currentUser",u);

        return "listausuarios";
    }

    //Expulsamos a un usuario de la base de datos
    @Transactional
    @PostMapping("/listausuarios/echar")
    public String listausuarios(Model model, HttpSession session,@RequestParam long id_reported) {

        //Mantenemos los atributo de ListaUsuarios...

        //Cogemos el usuario
        User u = entityManager.find(User.class, ((User) session.getAttribute("u")).getId());
        
        //Y lo añadimos al modelo
        model.addAttribute("currentUser",u);

        //Cogemos el usuario que vayamos a expulsar
        User user_reported = entityManager.find(User.class, id_reported);

        //Y lo eliminamos
        entityManager.remove(user_reported);

        //Una vez eliminado, buscamos a los usuarios que quedan para mostrarlos
        model.addAttribute("usuarios", entityManager.createQuery("SELECT u FROM User u").getResultList());

        return "listausuarios";
    }

    @GetMapping("/perfilusuario/{id}")
    public String perfilusuariox(@PathVariable long id,Model model) {
        //Buscamos el usuario
        User u = entityManager.find(User.class, id);
        model.addAttribute("user", u);

        return "perfilusuario";
    }

    @GetMapping("/")
    public String index(Model model) {
        return "index";
    }
}
