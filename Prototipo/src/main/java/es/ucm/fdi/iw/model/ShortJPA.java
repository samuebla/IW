package es.ucm.fdi.iw.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;

import lombok.Data;

@Entity
@Data
public class ShortJPA {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "short_gen")
    @SequenceGenerator(name = "short_gen", sequenceName = "short_gen")
    private long id;

    private Short value;

    public ShortJPA(short value) {
        this.value = value;
    }

    public short getValue() {
        return value;
    }

    public void setValue(short value) {
        this.value = value;
    }

}
