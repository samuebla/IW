package es.ucm.fdi.iw.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
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
@NamedQueries({
		@NamedQuery(name = "Message.countUnread", query = "SELECT COUNT(m) FROM Message m "
				+ "WHERE m.partida.id = :partidaId AND m.dateRead = null")
})
@Data
public class Message implements Transferable<Message.Transfer> {

	private static Logger log = LogManager.getLogger(Message.class);

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen")
	@SequenceGenerator(name = "gen", sequenceName = "gen")
	private long id;

	// AAA NO ME FIO REVISAR CREO QUE ES MANYTOMANY
	@ManyToOne
	private User sender;
	@ManyToOne
	private Partida partida;
	private String text;

	private LocalDateTime dateSent;
	private LocalDateTime dateRead;

	/**
	 * Objeto para persistir a/de JSON
	 * 
	 * @author mfreire
	 */
	@Getter
	@AllArgsConstructor
	public static class Transfer {
		private String from;
		private long to;
		private String sent;
		private String received;
		private String text;
		private String type; // always set to chat (see toTransfer)
		long id;

		public Transfer(Message m) {
			this.from = m.getSender().getUsername();
			this.to = m.getPartida().getId();
			this.sent = DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(m.getDateSent());
			this.received = m.getDateRead() == null ? null
					: DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(m.getDateRead());
			this.text = m.getText();
			this.id = m.getId();
		}
	}

	@Override
	public Transfer toTransfer() {
		return new Transfer(sender.getUsername(), partida.getId(),
				DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(dateSent),
				dateRead == null ? null : DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(dateRead),
				text, "CHAT", id);
	}
}
