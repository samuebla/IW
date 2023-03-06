package es.ucm.fdi.iw.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;

import lombok.Data;

/**
 * Un jugador que pertenece a una partida
 *
 */
@Entity
@Data
public class Jugador {

	@Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen")
    @SequenceGenerator(name = "gen", sequenceName = "gen")
	private long id;

	String team;

	int contadorFiguras;

	@ManyToOne
	User user;

	float temporizador;

	int piezasComidas;

	boolean ready;
}
