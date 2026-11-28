package vn.grabmefood.community;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpMethod;
import vn.grabmefood.collection.SupabaseCaller;
import vn.grabmefood.collection.UserDataApi;

/** Comment creation through the caller's own JWT and existing Data API RLS. */
public final class CommentService {
    private final SupabaseCaller caller;
    private final UserDataApi data;

    public CommentService(SupabaseCaller caller, UserDataApi data) {
        this.caller = caller;
        this.data = data;
    }

    public List<Map<String, Object>> create(String authorization, String kind, UUID targetId, String body) {
        UUID author = caller.requireActiveUser(authorization);
        if (!"restaurant".equals(kind) && !"dish".equals(kind)) throw new IllegalArgumentException();
        if (targetId == null || body == null || body.strip().isEmpty()
            || body.strip().length() > 2000) throw new IllegalArgumentException();
        String table = "restaurant".equals(kind) ? "restaurants" : "dishes";
        Map<String, String> filters = Map.of("id", "eq." + targetId, "is_public", "eq.true");
        if (data.read(authorization, table, "id", filters, "id.asc").isEmpty()) {
            throw new CommentNotFound();
        }
        return data.write(authorization, HttpMethod.POST, "comments", Map.of(),
            Map.of("author_id", author, "target_kind", kind, "target_id", targetId,
                "body", body.strip()));
    }

    public static final class CommentNotFound extends RuntimeException {}
}
