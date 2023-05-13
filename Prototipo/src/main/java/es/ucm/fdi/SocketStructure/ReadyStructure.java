package es.ucm.fdi.SocketStructure;

public class ReadyStructure {
    public String type;
    public String username;
    public long userId;
    public long partidaId;
    public boolean ready;
    public boolean startGame;

    public ReadyStructure(String typeAux, String usernameAux, long playerIdAux, long partidaIdAux, boolean readyAux,
            boolean startGameAux) {
        type = typeAux;
        username = usernameAux;
        userId = playerIdAux;
        partidaId = partidaIdAux;
        ready = readyAux;
        startGame = startGameAux;
    }
}
