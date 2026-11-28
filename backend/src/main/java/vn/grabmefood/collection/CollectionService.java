package vn.grabmefood.collection;

import java.security.SecureRandom;
import java.util.*;
import org.springframework.http.HttpMethod;

public final class CollectionService {
    private final SupabaseCaller caller;
    private final UserDataApi api;
    private final SecureRandom rng = new SecureRandom();

    public CollectionService(SupabaseCaller caller, UserDataApi api) {
        this.caller = caller;
        this.api = api;
    }

    public record SavedItem(UUID targetId, String kind, boolean available, Map<String, Object> content) {}

    public List<Map<String, Object>> list(String token) {
        return owned(token, caller.requireActiveUser(token));
    }

    private List<Map<String, Object>> owned(String token, UUID user) {
        return api.read(token, "collections", "id,kind,name", Map.of("owner_id", "eq." + user), "id.asc");
    }

    private Map<String, Object> requireCollection(String token, UUID user, UUID id) {
        return owned(token, user).stream().filter(c -> id.toString().equals(c.get("id")))
            .findFirst().orElseThrow(NotFound::new);
    }

    public List<Map<String, Object>> create(String token, String kind, String name) {
        checkKind(kind);
        String validName = checkName(name);
        UUID user = caller.requireActiveUser(token);
        return api.write(token, HttpMethod.POST, "collections", Map.of(),
            Map.of("owner_id", user, "kind", kind, "name", validName));
    }

    public List<Map<String, Object>> rename(String token, UUID id, String name) {
        String validName = checkName(name);
        UUID user = caller.requireActiveUser(token);
        requireCollection(token, user, id);
        var rows = api.write(token, HttpMethod.PATCH, "collections",
            Map.of("id", "eq." + id, "owner_id", "eq." + user), Map.of("name", validName));
        if (rows.isEmpty()) throw new NotFound();
        return rows;
    }

    public void delete(String token, UUID id) {
        UUID user = caller.requireActiveUser(token);
        requireCollection(token, user, id);
        api.write(token, HttpMethod.DELETE, "collections",
            Map.of("id", "eq." + id, "owner_id", "eq." + user), null);
        // Concurrent removal is idempotent; no catalog DELETE is ever issued.
    }

    public void save(String token, UUID collection, String kind, UUID target) {
        checkKind(kind);
        UUID user = caller.requireActiveUser(token);
        var owned = requireCollection(token, user, collection);
        if (!kind.equals(owned.get("kind"))) throw new IllegalArgumentException("Collection kind mismatch");
        if (content(token, kind, target).isEmpty()) throw new NotFound();
        api.write(token, HttpMethod.POST, "saved_items", Map.of(),
            Map.of("collection_id", collection, "target_kind", kind, "target_id", target));
    }

    public void unsave(String token, UUID collection, String kind, UUID target) {
        checkKind(kind);
        UUID user = caller.requireActiveUser(token);
        var owned = requireCollection(token, user, collection);
        if (!kind.equals(owned.get("kind"))) throw new IllegalArgumentException("Collection kind mismatch");
        api.write(token, HttpMethod.DELETE, "saved_items",
            Map.of("collection_id", "eq." + collection, "target_kind", "eq." + kind, "target_id", "eq." + target), null);
    }

    public List<SavedItem> items(String token, UUID collection) {
        UUID user = caller.requireActiveUser(token);
        var owned = requireCollection(token, user, collection);
        String kind = (String) owned.get("kind");
        List<SavedItem> result = new ArrayList<>();
        for (var row : saved(token, collection)) {
            UUID id = UUID.fromString((String) row.get("target_id"));
            var content = content(token, kind, id);
            result.add(new SavedItem(id, kind, !content.isEmpty(), content));
        }
        return result;
    }

    private List<Map<String, Object>> saved(String token, UUID collection) {
        return api.read(token, "saved_items", "collection_id,target_kind,target_id",
            Map.of("collection_id", "eq." + collection), "collection_id.asc,target_kind.asc,target_id.asc");
    }

    private Map<String, Object> content(String token, String kind, UUID id) {
        var rows = api.read(token, kind.equals("restaurant") ? "restaurants" : "dishes",
            kind.equals("restaurant") ? "id,name_vi,name_en" : "id,restaurant_id,name_vi,name_en,restaurants!inner(is_public)",
            kind.equals("restaurant") ? Map.of("id", "eq." + id, "is_public", "eq.true")
                : Map.of("id", "eq." + id, "is_public", "eq.true", "restaurants.is_public", "eq.true"), "id.asc");
        var row = rows.stream().filter(r -> id.toString().equals(r.get("id"))).findFirst();
        if (row.isEmpty()) return Map.of();
        var result = new HashMap<>(row.get());
        result.remove("restaurants");
        return result;
    }

    public Optional<SavedItem> random(String token, String kind, Set<UUID> selected) {
        checkKind(kind);
        UUID user = caller.requireActiveUser(token);
        List<RandomCandidates.SavedTarget> saved = new ArrayList<>();
        for (var collection : owned(token, user)) {
            if (!kind.equals(collection.get("kind"))) continue;
            for (var row : saved(token, UUID.fromString((String) collection.get("id")))) {
                saved.add(new RandomCandidates.SavedTarget((String) row.get("target_kind"),
                    UUID.fromString((String) row.get("target_id"))));
            }
        }
        Set<UUID> available = new HashSet<>();
        for (var row : saved) {
            if ((selected == null || selected.contains(row.id())) && !content(token, kind, row.id()).isEmpty()) {
                available.add(row.id());
            }
        }
        var candidates = new ArrayList<>(RandomCandidates.eligible(kind, saved, available, selected));
        while (!candidates.isEmpty()) {
            UUID chosen = candidates.remove(rng.nextInt(candidates.size()));
            // Re-read membership and availability, not cached candidate payloads.
            boolean stillSaved = false;
            for (var collection : owned(token, user)) {
                if (!kind.equals(collection.get("kind"))) continue;
                if (saved(token, UUID.fromString((String) collection.get("id"))).stream()
                    .anyMatch(row -> chosen.toString().equals(row.get("target_id")))) stillSaved = true;
            }
            var latest = stillSaved ? content(token, kind, chosen) : Map.<String, Object>of();
            caller.requireActiveUser(token);
            if (!latest.isEmpty()) return Optional.of(new SavedItem(chosen, kind, true, latest));
        }
        return Optional.empty();
    }

    private static void checkKind(String kind) {
        if (!"restaurant".equals(kind) && !"dish".equals(kind)) throw new IllegalArgumentException("Invalid kind");
    }
    private static String checkName(String name) {
        if (name == null) throw new IllegalArgumentException("Name required");
        String trimmed = name.strip();
        int length = trimmed.codePointCount(0, trimmed.length());
        if (length < 1 || length > 80) throw new IllegalArgumentException("Name must be 1..80 characters");
        return trimmed;
    }
    public static final class NotFound extends RuntimeException {}
    public static final class Conflict extends RuntimeException {}
}
