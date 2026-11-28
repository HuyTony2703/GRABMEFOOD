package vn.grabmefood.collection;

import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

class SupabaseCallerTest {
    private HttpServer server;
    private String url;
    private String authBody;
    private int authStatus;
    private String activeBody;

    @BeforeEach void start() throws Exception {
        authBody = "{\"id\":\"00000000-0000-0000-0000-000000000001\"}";
        authStatus = 200;
        activeBody = "true";
        server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.createContext("/auth/v1/user", exchange -> {
            assertEquals("Bearer test-token", exchange.getRequestHeaders().getFirst("Authorization"));
            assertEquals("public-test-key", exchange.getRequestHeaders().getFirst("apikey"));
            byte[] body = authBody.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(authStatus, body.length);
            exchange.getResponseBody().write(body);
            exchange.close();
        });
        server.createContext("/rest/v1/rpc/is_active", exchange -> {
            assertEquals("POST", exchange.getRequestMethod());
            assertEquals("Bearer test-token", exchange.getRequestHeaders().getFirst("Authorization"));
            assertEquals("{}", new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8));
            byte[] body = activeBody.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, body.length);
            exchange.getResponseBody().write(body);
            exchange.close();
        });
        server.start();
        url = "http://127.0.0.1:" + server.getAddress().getPort();
    }

    @AfterEach void stop() { server.stop(0); }

    @Test void verifiesAuthUserAndCurrentActiveState() {
        assertEquals(UUID.fromString("00000000-0000-0000-0000-000000000001"),
            new SupabaseCaller(url, "public-test-key").requireActiveUser("Bearer test-token"));
    }

    @Test void rejectsMissingBearerBeforeRequest() {
        assertThrows(SupabaseCaller.AccessDenied.class,
            () -> new SupabaseCaller(url, "public-test-key").requireActiveUser(null));
    }

    @Test void rejectsInvalidToken() {
        authStatus = 401;
        authBody = "{\"message\":\"invalid\"}";
        assertThrows(SupabaseCaller.AccessDenied.class,
            () -> new SupabaseCaller(url, "public-test-key").requireActiveUser("Bearer test-token"));
    }

    @Test void rejectsLockedAccountEvenWithValidAuthToken() {
        activeBody = "false";
        assertThrows(SupabaseCaller.AccessDenied.class,
            () -> new SupabaseCaller(url, "public-test-key").requireActiveUser("Bearer test-token"));
    }

    @Test void malformedIdentityDoesNotCreateCaller() {
        authBody = "{}";
        assertThrows(SupabaseCaller.UpstreamFailure.class,
            () -> new SupabaseCaller(url, "public-test-key").requireActiveUser("Bearer test-token"));
    }

    @Test void upstreamAuthFailureDoesNotLookLikeValidSession() {
        authStatus = 503;
        assertThrows(SupabaseCaller.UpstreamFailure.class,
            () -> new SupabaseCaller(url, "public-test-key").requireActiveUser("Bearer test-token"));
    }
}
