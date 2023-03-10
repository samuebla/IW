package es.ucm.fdi.iw.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Column;
import javax.persistence.SequenceGenerator;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * Una partida donde los jugadores juegan o una partida pasada
 *
 */
@Entity
@Data
public class Partida {

	@Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen")
    @SequenceGenerator(name = "gen", sequenceName = "gen")
	private long id;

	private enum States {
		Lobby, OnGame, Finished
	}

	@Column(nullable = false)
	States currentState;

	String tablero;

	@OneToMany
	List<Message> received = new ArrayList<>();

	@OneToMany
	List<Jugador> jugadores = new ArrayList<>();

	int tiempoTotal;

	int incrementoTiempoPorTurno;

	enum ColoresEquipos {
		Rojo, Azul, Verde, Amarillo
	}
}
