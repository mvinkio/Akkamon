package akkamon.domain.model.akkamon.moves.implementations;

import akkamon.domain.model.akkamon.Mon;
import akkamon.domain.model.akkamon.Stat;
import akkamon.domain.model.akkamon.moves.MoveCategory;

public class SwordsDance extends Mon.Move {

    public SwordsDance(String name, Mon.Type type, MoveCategory category, Stat PP, int power, int accuracy) {
        super(name, type, category, PP, power, accuracy);
    }
}
