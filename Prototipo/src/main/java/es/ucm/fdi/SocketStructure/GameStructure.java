package es.ucm.fdi.SocketStructure;

public class GameStructure {
    public String type;
    public int pieceType;
    public int pieceTeam;
    public int newPositionX;
    public int newPositionY;

    public GameStructure(String typeAux, int pieceTypeAux, int pieceTeamAux, int newPositionXAux, int newPositionYAux) {
        type = typeAux;
        pieceType = pieceTypeAux;
        pieceTeam = pieceTeamAux;
        newPositionX = newPositionXAux;
        newPositionY = newPositionYAux;
    }
}
