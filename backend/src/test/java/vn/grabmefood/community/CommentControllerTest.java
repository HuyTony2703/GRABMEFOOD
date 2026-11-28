package vn.grabmefood.community;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class CommentControllerTest {
    @Test void unauthenticatedCommentIsRejectedWithoutEchoingBody() throws Exception {
        MockMvcBuilders.standaloneSetup(new CommentController(null))
            .build().perform(post("/api/comments")
                .contentType("application/json")
                .content("{\"kind\":\"restaurant\",\"targetId\":\"00000000-0000-0000-0000-000000000003\",\"body\":\"Private\"}"))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.error").value("access_denied"))
            .andExpect(header().string("Cache-Control", "no-store"));
    }
}
