package es.ucm.fdi.iw.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Column;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.SequenceGenerator;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import lombok.Data;
import lombok.Getter;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * A message that users can send each other.
 *
 */
@Entity
@Data
public class Partida {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY, generator = "ojo")
	@SequenceGenerator(name = "ojo", sequenceName = "ojo")
	private long id;

	private enum States {
		Lobby, OnGame, Finished
	}

	@Column(nullable = false)
	States currentState;

	@OneToMany
	List<Short> tablero = new ArrayList<>();

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
