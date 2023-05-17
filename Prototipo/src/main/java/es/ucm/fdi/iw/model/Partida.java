package es.ucm.fdi.iw.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
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

	public enum State {
		Lobby, OnGame, Finished
	}

	@Column(nullable = false)
	int currentState;

	public String topicId;

	public String tableroTeams;
	public String tableroTypes;

	public boolean gameStarted;

	public long idCurrentPlayerTurn;

	@OneToMany
	@JoinColumn(name = "partida_id")
	List<Message> received = new ArrayList<>();

	@OneToMany
	@JoinColumn(name = "jugador_id")
	List<Jugador> jugadores = new ArrayList<>();

	int tiempoTotal;

	int incrementoTiempoPorTurno;

	enum ColoresEquipos {
		Blanco, Rojo, Negro, Azul
	}
}
