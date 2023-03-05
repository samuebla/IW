package es.ucm.fdi.iw.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.JoinColumn;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import lombok.Data;
import lombok.Getter;
import lombok.AllArgsConstructor;

/**
 * A message that users can send each other.
 *
 */
@Entity
@Data
public class Denuncia {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY, generator = "denuncia")
	@SequenceGenerator(name = "denuncia", sequenceName = "denuncia")
	private long id;

	// Partida partida;

	@ManyToOne
	User user;

	// /**
	// * Objeto para persistir a/de JSON
	// * @author mfreire
	// */
	// @Getter
	// @AllArgsConstructor
	// public static class Transfer {
	// private String from;
	// private String to;
	// private String sent;
	// private String received;
	// private String text;
	// long id;
	// public Transfer(Jugador j) {
	// this.from = m.getSender().getUsername();
	// this.to = m.getRecipient().getUsername();
	// this.sent = DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(m.getDateSent());
	// this.received = m.getDateRead() == null ?
	// null : DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(m.getDateRead());
	// this.text = m.getText();
	// this.id = m.getId();
	// }
	// }

	// @Override
	// public Transfer toTransfer() {
	// return new Transfer(sender.getUsername(), recipient.getUsername(),
	// DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(dateSent),
	// dateRead == null ? null :
	// DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(dateRead),
	// text, id
	// );
	// }
}
