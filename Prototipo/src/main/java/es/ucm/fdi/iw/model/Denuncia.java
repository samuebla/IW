package es.ucm.fdi.iw.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;

import lombok.Data;

/**
 * Denuncia realizada a un jugador
 *
 */
@Entity
@Data
public class Denuncia {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY, generator = "denuncia_gen")
	@SequenceGenerator(name = "denuncia_gen", sequenceName = "denuncia_gen")
	private long id;

	@ManyToOne
	Partida partida;

	@ManyToOne
	User user;
}
