package vn.grabmefood.collection;

import java.net.http.HttpClient;
import java.time.Duration;
import java.util.*;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.*;

/** All requests retain the caller JWT: no elevated credential and no user data cache. */
public final class UserDataApi {
    private static final int PAGE_SIZE = 200;
    private static final ParameterizedTypeReference<List<Map<String, Object>>> ROWS =
        new ParameterizedTypeReference<>() {};
    private final RestClient client;

    public UserDataApi(String url, String key) {
        var http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5))
            .followRedirects(HttpClient.Redirect.NEVER).build();
        var factory = new JdkClientHttpRequestFactory(http);
        factory.setReadTimeout(Duration.ofSeconds(10));
        client = RestClient.builder().baseUrl(url + "/rest/v1").requestFactory(factory)
            .defaultHeader("apikey", key).build();
    }

    public List<Map<String, Object>> read(String token, String table, String columns,
                                          Map<String, String> filters, String order) {
        var result = new ArrayList<Map<String, Object>>();
        for (int offset = 0; ; offset += PAGE_SIZE) {
            final int start = offset;
            List<Map<String, Object>> page;
            try {
                page = client.get().uri(builder -> {
                    builder.path("/" + table).queryParam("select", columns)
                        .queryParam("order", order).queryParam("limit", PAGE_SIZE).queryParam("offset", start);
                    filters.forEach(builder::queryParam);
                    return builder.build();
                }).header("Authorization", token).retrieve().body(ROWS);
            } catch (RestClientException e) { throw failure(e); }
            if (page == null) throw new SupabaseCaller.UpstreamFailure();
            result.addAll(page);
            if (page.size() < PAGE_SIZE) return result;
            // Fail closed rather than silently presenting a truncated private dataset.
            if (offset >= 200_000) throw new SupabaseCaller.UpstreamFailure();
        }
    }

    public List<Map<String, Object>> write(String token, HttpMethod method, String table,
                                            Map<String, String> filters, Object body) {
        try {
            var request = client.method(method).uri(builder -> {
                builder.path("/" + table);
                filters.forEach(builder::queryParam);
                return builder.build();
            }).header("Authorization", token).header("Prefer", "return=representation")
                .contentType(MediaType.APPLICATION_JSON);
            if (body != null) request.body(body);
            var rows = request.retrieve().body(ROWS);
            return rows == null ? List.of() : rows;
        } catch (RestClientException e) { throw failure(e); }
    }

    private RuntimeException failure(RestClientException e) {
        if (e instanceof RestClientResponseException response) {
            int code = response.getStatusCode().value();
            if (code == 401 || code == 403) return new SupabaseCaller.AccessDenied();
            if (code == 409) return new CollectionService.Conflict();
        }
        return new SupabaseCaller.UpstreamFailure();
    }
}
