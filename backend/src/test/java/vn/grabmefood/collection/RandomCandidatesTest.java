package vn.grabmefood.collection;

import org.junit.jupiter.api.Test;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

class RandomCandidatesTest {
    private final UUID a = UUID.fromString("00000000-0000-0000-0000-000000000001");
    private final UUID b = UUID.fromString("00000000-0000-0000-0000-000000000002");
    private final UUID c = UUID.fromString("00000000-0000-0000-0000-000000000003");

    @Test void duplicateSavedTargetsCountOnlyOnce() {
        assertEquals(List.of(a, b), RandomCandidates.eligible("restaurant",
            List.of(item("restaurant", a), item("restaurant", a), item("restaurant", b)),
            Set.of(a, b), null));
    }

    @Test void unavailableAndWrongKindCannotParticipate() {
        assertEquals(List.of(a), RandomCandidates.eligible("dish",
            List.of(item("dish", a), item("dish", b), item("restaurant", c)),
            Set.of(a, c), null));
    }

    @Test void selectedCannotIntroduceUnsavedTargets() {
        assertEquals(List.of(b), RandomCandidates.eligible("dish",
            List.of(item("dish", a), item("dish", b)),
            Set.of(a, b, c), Set.of(b, c)));
    }

    @Test void emptySelectionDoesNotFallBackToAllSaved() {
        assertEquals(List.of(), RandomCandidates.eligible("dish",
            List.of(item("dish", a)), Set.of(a), Set.of()));
    }

    @Test void unavailableSetProducesNoCandidate() {
        assertEquals(List.of(), RandomCandidates.eligible("dish",
            List.of(item("dish", a)), Set.of(), null));
    }

    @Test void invalidKindIsRejected() {
        assertThrows(IllegalArgumentException.class,
            () -> RandomCandidates.eligible("anything", List.of(), Set.of(), null));
    }

    private RandomCandidates.SavedTarget item(String kind, UUID id) {
        return new RandomCandidates.SavedTarget(kind, id);
    }
}
