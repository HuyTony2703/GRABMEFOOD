package vn.grabmefood.community;

import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.*;
import vn.grabmefood.collection.SupabaseCaller;
import vn.grabmefood.collection.UserDataApi;

@RestController
@RequestMapping("/api/comments")
public final class CommentController {
    private final CommentService service;

    @Autowired
    public CommentController(@Value("${GMF_SUPABASE_URL:}") String url,
                             @Value("${GMF_SUPABASE_PUBLISHABLE_KEY:}") String key) {
        this(url.isBlank() || key.isBlank() ? null :
            new CommentService(new SupabaseCaller(url, key), new UserDataApi(url, key)));
    }

    CommentController(CommentService service) { this.service = service; }

    public record NewComment(String kind, UUID targetId, String body) {}

    @PostMapping
    public ResponseEntity<?> create(@RequestHeader(value = "Authorization", required = false) String authorization,
                                    @RequestBody NewComment input) {
        if (authorization == null) throw new SupabaseCaller.AccessDenied();
        if (service == null) throw new SupabaseCaller.UpstreamFailure();
        return ResponseEntity.status(HttpStatus.CREATED).cacheControl(CacheControl.noStore())
            .body(service.create(authorization, input.kind(), input.targetId(), input.body()));
    }

    @ExceptionHandler(SupabaseCaller.AccessDenied.class)
    ResponseEntity<?> denied() { return error(HttpStatus.UNAUTHORIZED, "access_denied"); }

    @ExceptionHandler(SupabaseCaller.UpstreamFailure.class)
    ResponseEntity<?> upstream() { return error(HttpStatus.SERVICE_UNAVAILABLE, "upstream_unavailable"); }

    @ExceptionHandler(CommentService.CommentNotFound.class)
    ResponseEntity<?> notFound() { return error(HttpStatus.NOT_FOUND, "not_found"); }

    @ExceptionHandler({IllegalArgumentException.class, HttpMessageNotReadableException.class})
    ResponseEntity<?> invalid() { return error(HttpStatus.BAD_REQUEST, "invalid_request"); }

    private ResponseEntity<?> error(HttpStatus status, String code) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore())
            .body(Map.of("error", code));
    }
}
