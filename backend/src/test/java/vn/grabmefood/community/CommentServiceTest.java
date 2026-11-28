package vn.grabmefood.community;

import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.*;
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;
import vn.grabmefood.collection.SupabaseCaller;
import vn.grabmefood.collection.UserDataApi;

class CommentServiceTest {
    private HttpServer upstream;
    private CommentService service;
    private final List<String> writes = new ArrayList<>();
    private boolean available = true;
    private static final UUID USER = UUID.fromString("00000000-0000-0000-0000-000000000001");
    private static final UUID TARGET = UUID.fromString("00000000-0000-0000-0000-000000000003");

    @BeforeEach void start() throws Exception {
        upstream = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        upstream.createContext("/", exchange -> {
            String path = exchange.getRequestURI().getPath();
            String method = exchange.getRequestMethod();
            String response = "[]";
            if (path.equals("/auth/v1/user")) response = "{\"id\":\"" + USER + "\"}";
            else if (path.equals("/rest/v1/rpc/is_active")) response = "true";
            else if (path.equals("/rest/v1/restaurants"))
                response = available ? "[{\"id\":\"" + TARGET + "\"}]" : "[]";
            else if (path.equals("/rest/v1/comments") && method.equals("POST")) {
                String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
                writes.add(body);
                response = "[" + body + "]";
            }
            byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, bytes.length);
            exchange.getResponseBody().write(bytes);
            exchange.close();
        });
        upstream.start();
        String url = "http://127.0.0.1:" + upstream.getAddress().getPort();
        service = new CommentService(new SupabaseCaller(url, "test-public"), new UserDataApi(url, "test-public"));
    }

    @AfterEach void stop() { upstream.stop(0); }

    @Test void createsTrimmedCommentForVerifiedCallerOnPublicRestaurant() {
        service.create("Bearer test-token", "restaurant", TARGET, "  Món ngon  ");
        assertEquals(1, writes.size());
        assertTrue(writes.getFirst().contains("\"author_id\":\"" + USER + "\""));
        assertTrue(writes.getFirst().contains("\"body\":\"Món ngon\""));
    }

    @Test void rejectsBlankOrOverlongBodyWithoutWriting() {
        assertThrows(IllegalArgumentException.class,
            () -> service.create("Bearer test-token", "restaurant", TARGET, " "));
        assertThrows(IllegalArgumentException.class,
            () -> service.create("Bearer test-token", "restaurant", TARGET, "a".repeat(2001)));
        assertTrue(writes.isEmpty());
    }

    @Test void hiddenTargetCannotReceiveComment() {
        available = false;
        assertThrows(CommentService.CommentNotFound.class,
            () -> service.create("Bearer test-token", "restaurant", TARGET, "No"));
        assertTrue(writes.isEmpty());
    }
}
