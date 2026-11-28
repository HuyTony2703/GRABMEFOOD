package vn.grabmefood.collection;

import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.*;
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class CollectionServiceTest {
    private HttpServer server;
    private CollectionService service;
    private final List<String> requests = new ArrayList<>();
    private final List<String> writes = new ArrayList<>();
    private static final UUID USER = UUID.fromString("00000000-0000-0000-0000-000000000001");
    private static final UUID COLLECTION = UUID.fromString("00000000-0000-0000-0000-000000000002");
    private static final UUID TARGET = UUID.fromString("00000000-0000-0000-0000-000000000003");
    private String collections;
    private boolean active;
    private boolean available;
    private int savedReads;
    private boolean removedBeforeResult;
    private int collectionPages;

    @BeforeEach void start() throws Exception {
        active = true;
        available = true;
        collections = "[{\"id\":\"" + COLLECTION + "\",\"kind\":\"restaurant\",\"name\":\"Lunch\"}]";
        server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.createContext("/", exchange -> {
            String path = exchange.getRequestURI().getPath();
            String query = Objects.toString(exchange.getRequestURI().getQuery(), "");
            String method = exchange.getRequestMethod();
            requests.add(method + " " + path + "?" + query);
            assertEquals("Bearer test-token", exchange.getRequestHeaders().getFirst("Authorization"));
            assertEquals("test-public", exchange.getRequestHeaders().getFirst("apikey"));
            String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
            String response = "[]";
            int status = 200;
            if (path.equals("/auth/v1/user")) response = "{\"id\":\"" + USER + "\"}";
            else if (path.equals("/rest/v1/rpc/is_active")) response = Boolean.toString(active);
            else if (path.equals("/rest/v1/collections") && method.equals("GET")) {
                collectionPages++;
                response = collections;
                if (query.contains("offset=200")) response = "[]";
            } else if (path.equals("/rest/v1/saved_items") && method.equals("GET")) {
                savedReads++;
                response = removedBeforeResult && savedReads > 1 ? "[]" :
                    "[{\"collection_id\":\"" + COLLECTION + "\",\"target_kind\":\"restaurant\",\"target_id\":\"" + TARGET + "\"}]";
            } else if (path.equals("/rest/v1/restaurants") && method.equals("GET")) {
                response = available ? "[{\"id\":\"" + TARGET + "\",\"name_vi\":\"Quán thử\",\"name_en\":\"Test restaurant\"}]" : "[]";
            } else if (!method.equals("GET")) {
                writes.add(method + " " + body);
                response = method.equals("DELETE") ? "[]" : collections;
            } else status = 404;
            byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(status, bytes.length);
            exchange.getResponseBody().write(bytes);
            exchange.close();
        });
        server.start();
        String url = "http://127.0.0.1:" + server.getAddress().getPort();
        service = new CollectionService(new SupabaseCaller(url, "test-public"), new UserDataApi(url, "test-public"));
    }
    @AfterEach void stop() { server.stop(0); }

    @Test void createsForVerifiedUserWithTrimmedNameNotClientOwner() {
        service.create("Bearer test-token", "restaurant", " Lunch ");
        assertTrue(writes.getFirst().contains("\"owner_id\":\"" + USER + "\""));
        assertTrue(writes.getFirst().contains("\"name\":\"Lunch\""));
    }

    @Test void emptyAndOverlongNamesAreRejectedWithoutWrite() {
        assertThrows(IllegalArgumentException.class, () -> service.create("Bearer test-token", "dish", "  "));
        assertThrows(IllegalArgumentException.class, () -> service.create("Bearer test-token", "dish", "a".repeat(81)));
        assertTrue(writes.isEmpty());
    }

    @Test void wrongCollectionIsNotWritable() {
        collections = "[]";
        assertThrows(CollectionService.NotFound.class, () -> service.rename("Bearer test-token", COLLECTION, "New"));
        assertTrue(writes.isEmpty());
    }

    @Test void lockedCallerCannotReadOrWriteCollections() {
        active = false;
        assertThrows(SupabaseCaller.AccessDenied.class, () -> service.list("Bearer test-token"));
        assertFalse(requests.stream().anyMatch(r -> r.contains("/rest/v1/collections")));
    }

    @Test void listIsOwnerFilteredAndReadsAllPages() {
        collections = "[" + String.join(",", Collections.nCopies(200,
            "{\"id\":\"" + COLLECTION + "\",\"kind\":\"restaurant\",\"name\":\"Lunch\"}")) + "]";
        assertEquals(200, service.list("Bearer test-token").size());
        assertEquals(2, collectionPages);
        assertTrue(requests.stream().anyMatch(r -> r.contains("owner_id=eq." + USER)));
    }

    @Test void savingChecksCollectionKindAndAvailability() {
        assertThrows(IllegalArgumentException.class,
            () -> service.save("Bearer test-token", COLLECTION, "dish", TARGET));
        available = false;
        assertThrows(CollectionService.NotFound.class,
            () -> service.save("Bearer test-token", COLLECTION, "restaurant", TARGET));
        assertTrue(writes.isEmpty());
    }

    @Test void savesIntoOneOwnedCollection() {
        service.save("Bearer test-token", COLLECTION, "restaurant", TARGET);
        assertTrue(writes.getFirst().contains("\"collection_id\":\"" + COLLECTION + "\""));
        assertTrue(writes.getFirst().contains("\"target_id\":\"" + TARGET + "\""));
    }

    @Test void deleteCollectionDoesNotDeleteCatalogTarget() {
        service.delete("Bearer test-token", COLLECTION);
        assertTrue(requests.stream().anyMatch(r -> r.startsWith("DELETE /rest/v1/collections?")));
        assertFalse(requests.stream().anyMatch(r -> r.startsWith("DELETE /rest/v1/restaurants")));
    }

    @Test void hiddenTargetIsOnlyAnUnavailableMarker() {
        available = false;
        var rows = service.items("Bearer test-token", COLLECTION);
        assertEquals(1, rows.size());
        assertFalse(rows.getFirst().available());
        assertEquals(Map.of(), rows.getFirst().content());
    }

    @Test void randomCannotIntroduceUnsavedId() {
        var result = service.random("Bearer test-token", "restaurant",
            Set.of(UUID.fromString("00000000-0000-0000-0000-000000000099")));
        assertTrue(result.isEmpty());
    }

    @Test void randomReturnsAvailableSavedTarget() {
        var result = service.random("Bearer test-token", "restaurant", null);
        assertEquals(TARGET, result.orElseThrow().targetId());
        assertTrue(savedReads >= 2, "Recheck saved membership before returning result");
    }

    @Test void concurrentlyRemovedSavedTargetIsNotReturned() {
        removedBeforeResult = true;
        assertTrue(service.random("Bearer test-token", "restaurant", null).isEmpty());
    }

    @Test void collectionRouteRejectsAnonymousCallerAndNeverCachesPrivateResponse() throws Exception {
        MockMvcBuilders.standaloneSetup(new CollectionController(service)).build()
            .perform(get("/api/collections")).andExpect(status().isUnauthorized())
            .andExpect(header().string("Cache-Control", "no-store"));
    }

    @Test void collectionRouteListsVerifiedOwnerRows() throws Exception {
        MockMvcBuilders.standaloneSetup(new CollectionController(service)).build()
            .perform(get("/api/collections").header("Authorization", "Bearer test-token"))
            .andExpect(status().isOk()).andExpect(jsonPath("$[0].name").value("Lunch"));
    }

    @Test void createRouteDoesNotAcceptOwnerIdOverride() throws Exception {
        MockMvcBuilders.standaloneSetup(new CollectionController(service)).build()
            .perform(post("/api/collections").header("Authorization", "Bearer test-token")
                .contentType("application/json").content("{\"kind\":\"restaurant\",\"name\":\"New\",\"owner_id\":\"attacker\"}"))
            .andExpect(status().isCreated());
        assertTrue(writes.getFirst().contains(USER.toString()));
        assertFalse(writes.getFirst().contains("attacker"));
    }

    @Test void randomEmptySetHasExplicitResult() throws Exception {
        MockMvcBuilders.standaloneSetup(new CollectionController(service)).build()
            .perform(post("/api/random").header("Authorization", "Bearer test-token")
                .contentType("application/json").content("{\"kind\":\"restaurant\",\"selected\":[]}"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.state").value("empty"));
    }

    @Test void invalidRequestProducesSafeBadRequest() throws Exception {
        MockMvcBuilders.standaloneSetup(new CollectionController(service)).build()
            .perform(post("/api/collections").header("Authorization", "Bearer test-token")
                .contentType("application/json").content("{\"kind\":\"invalid\",\"name\":\"New\"}"))
            .andExpect(status().isBadRequest()).andExpect(jsonPath("$.error").value("invalid_request"));
    }
}
