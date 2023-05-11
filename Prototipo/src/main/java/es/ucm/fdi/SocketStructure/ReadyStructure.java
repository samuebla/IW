package es.ucm.fdi.SocketStructure;

public class ReadyStructure {
    public String type;
    public String username;
    public long userId;
    public long partidaId;
    public boolean ready;

    public ReadyStructure(String typeAux, String usernameAux, long playerIdAux, long partidaIdAux, boolean readyAux) {
        type = typeAux;
        username = usernameAux;
        userId = playerIdAux;
        partidaId = partidaIdAux;
        ready = readyAux;
    }
}
