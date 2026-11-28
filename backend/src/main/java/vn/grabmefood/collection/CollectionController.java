package vn.grabmefood.collection;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestController
@RequestMapping("/api")
public final class CollectionController {
    private final CollectionService service;

    @Autowired
    public CollectionController(@Value("${GMF_SUPABASE_URL:}") String url,
                                @Value("${GMF_SUPABASE_PUBLISHABLE_KEY:}") String key) {
        service = url.isBlank() || key.isBlank() ? null :
            new CollectionService(new SupabaseCaller(url, key), new UserDataApi(url, key));
    }

    CollectionController(CollectionService service) { this.service = service; }

    private CollectionService service() {
        if (service == null) throw new SupabaseCaller.UpstreamFailure();
        return service;
    }
    public record NewCollection(String kind, String name) {}
    public record RenameCollection(String name) {}
    public record SaveTarget(String kind, UUID targetId) {}
    public record RandomRequest(String kind, Set<UUID> selected) {}
    private <T> ResponseEntity<T> response(HttpStatus status, T body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }

    @GetMapping("/collections")
    public ResponseEntity<?> list(@RequestHeader(value="Authorization", required=false) String auth) {
        return response(HttpStatus.OK, service().list(auth));
    }
    @PostMapping("/collections")
    public ResponseEntity<?> create(@RequestHeader(value="Authorization", required=false) String auth,
                                    @RequestBody NewCollection request) {
        return response(HttpStatus.CREATED, service().create(auth, request.kind(), request.name()));
    }
    @PatchMapping("/collections/{id}")
    public ResponseEntity<?> rename(@RequestHeader(value="Authorization", required=false) String auth,
                                    @PathVariable UUID id, @RequestBody RenameCollection request) {
        return response(HttpStatus.OK, service().rename(auth, id, request.name()));
    }
    @DeleteMapping("/collections/{id}")
    public ResponseEntity<?> delete(@RequestHeader(value="Authorization", required=false) String auth,
                                    @PathVariable UUID id) {
        service().delete(auth, id);
        return response(HttpStatus.NO_CONTENT, null);
    }
    @GetMapping("/collections/{id}/items")
    public ResponseEntity<?> items(@RequestHeader(value="Authorization", required=false) String auth,
                                   @PathVariable UUID id) {
        return response(HttpStatus.OK, service().items(auth, id));
    }
    @PostMapping("/collections/{id}/items")
    public ResponseEntity<?> save(@RequestHeader(value="Authorization", required=false) String auth,
                                  @PathVariable UUID id, @RequestBody SaveTarget request) {
        if (request.targetId() == null) throw new IllegalArgumentException();
        service().save(auth, id, request.kind(), request.targetId());
        return response(HttpStatus.CREATED, Map.of("state", "saved"));
    }
    @DeleteMapping("/collections/{id}/items/{kind}/{target}")
    public ResponseEntity<?> unsave(@RequestHeader(value="Authorization", required=false) String auth,
                                    @PathVariable UUID id, @PathVariable String kind, @PathVariable UUID target) {
        service().unsave(auth, id, kind, target);
        return response(HttpStatus.NO_CONTENT, null);
    }
    @PostMapping("/random")
    public ResponseEntity<?> random(@RequestHeader(value="Authorization", required=false) String auth,
                                    @RequestBody RandomRequest request) {
        var result = service().random(auth, request.kind(), request.selected());
        return response(HttpStatus.OK, result.<Map<String, Object>>map(
            item -> Map.of("state", "result", "item", item)).orElse(Map.of("state", "empty")));
    }

    @ExceptionHandler(SupabaseCaller.AccessDenied.class)
    public ResponseEntity<?> denied() { return response(HttpStatus.UNAUTHORIZED, Map.of("error", "access_denied")); }
    @ExceptionHandler(SupabaseCaller.UpstreamFailure.class)
    public ResponseEntity<?> upstream() { return response(HttpStatus.SERVICE_UNAVAILABLE, Map.of("error", "upstream_unavailable")); }
    @ExceptionHandler(CollectionService.NotFound.class)
    public ResponseEntity<?> missing() { return response(HttpStatus.NOT_FOUND, Map.of("error", "not_found")); }
    @ExceptionHandler(CollectionService.Conflict.class)
    public ResponseEntity<?> conflict() { return response(HttpStatus.CONFLICT, Map.of("error", "already_saved")); }
    @ExceptionHandler({IllegalArgumentException.class, HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class})
    public ResponseEntity<?> invalid() { return response(HttpStatus.BAD_REQUEST, Map.of("error", "invalid_request")); }
}
