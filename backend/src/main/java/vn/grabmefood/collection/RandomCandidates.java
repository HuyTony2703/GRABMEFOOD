package vn.grabmefood.collection;

import java.util.List;
import java.util.Set;
import java.util.UUID;

/** Candidate filtering only: caller must supply owner-scoped saved rows and current availability. */
public final class RandomCandidates {
    private RandomCandidates() {}

    public record SavedTarget(String kind, UUID id) {}

    /** Null selected means all saved; an empty set explicitly means no selection. */
    public static List<UUID> eligible(String kind, List<SavedTarget> saved,
                                      Set<UUID> available, Set<UUID> selected) {
        if (!"restaurant".equals(kind) && !"dish".equals(kind)) {
            throw new IllegalArgumentException("Unsupported target kind");
        }
        return saved.stream()
            .filter(target -> kind.equals(target.kind()))
            .map(SavedTarget::id)
            .filter(available::contains)
            .filter(id -> selected == null || selected.contains(id))
            .distinct()
            .toList();
    }
}
