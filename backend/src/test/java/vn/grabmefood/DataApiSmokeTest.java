package vn.grabmefood;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import org.junit.jupiter.api.Test;

class DataApiSmokeTest {

	@Test
	void publishableKeyReachesDataApiWithoutWriting() throws Exception {
		String url = System.getenv("GMF_SUPABASE_URL");
		String key = System.getenv("GMF_SUPABASE_PUBLISHABLE_KEY");
		assumeTrue(url != null && !url.isBlank() && key != null && !key.isBlank(),
			"Live smoke requires a project URL and publishable key in process environment");

		URI uri = URI.create(url + "/rest/v1/restaurants?select=id&limit=1");
		HttpRequest request = HttpRequest.newBuilder(uri)
			.timeout(Duration.ofSeconds(10))
			.header("apikey", key)
			.GET()
			.build();
		try (HttpClient client = HttpClient.newHttpClient()) {
			HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
			assertTrue(response.statusCode() == 200 && response.body().startsWith("[")
				&& response.body().contains("\"id\""),
				"Data API must return real public rows; actual status: "
					+ response.statusCode());
		}
	}
}
