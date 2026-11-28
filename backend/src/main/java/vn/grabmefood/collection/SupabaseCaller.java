package vn.grabmefood.collection;

import java.net.http.HttpClient;
import java.time.Duration;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

/** Verifies tokens remotely rather than trusting an unverified JWT payload. */
public final class SupabaseCaller {
    private final RestClient client;

    public SupabaseCaller(String url, String publishableKey) {
        var http = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .followRedirects(HttpClient.Redirect.NEVER).build();
        var factory = new JdkClientHttpRequestFactory(http);
        factory.setReadTimeout(Duration.ofSeconds(10));
        client = RestClient.builder().baseUrl(url)
            .requestFactory(factory).defaultHeader("apikey", publishableKey).build();
    }

    public UUID requireActiveUser(String authorization) {
        if (authorization == null || !authorization.matches("Bearer [A-Za-z0-9._~+/-]+=*")) {
            throw new AccessDenied();
        }
        try {
            Map<?, ?> user = client.get().uri("/auth/v1/user")
                .header("Authorization", authorization).retrieve().body(Map.class);
            if (user == null || !(user.get("id") instanceof String id)) {
                throw new UpstreamFailure();
            }
            UUID userId;
            try { userId = UUID.fromString(id); }
            catch (IllegalArgumentException e) { throw new UpstreamFailure(); }
            Boolean active = client.post().uri("/rest/v1/rpc/is_active")
                .header("Authorization", authorization).contentType(MediaType.APPLICATION_JSON)
                .body(Map.of()).retrieve().body(Boolean.class);
            if (active == null) throw new UpstreamFailure();
            if (!active) throw new AccessDenied();
            return userId;
        } catch (RestClientResponseException e) {
            if (e.getStatusCode().value() == 401 || e.getStatusCode().value() == 403) {
                throw new AccessDenied();
            }
            throw new UpstreamFailure();
        } catch (RestClientException e) {
            // Do not include upstream bodies, URLs or tokens in public exceptions.
            throw new UpstreamFailure();
        }
    }

    public static final class AccessDenied extends RuntimeException {
        public AccessDenied() { super("Access denied"); }
    }
    public static final class UpstreamFailure extends RuntimeException {
        public UpstreamFailure() { super("Authentication upstream unavailable"); }
    }
}
