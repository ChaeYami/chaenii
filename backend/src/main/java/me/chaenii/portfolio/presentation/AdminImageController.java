package me.chaenii.portfolio.presentation;

import me.chaenii.portfolio.infrastructure.S3ImageService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/images")
public class AdminImageController {

    private final S3ImageService s3ImageService;

    public AdminImageController(S3ImageService s3ImageService) {
        this.s3ImageService = s3ImageService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Map<String, String>> upload(@RequestParam MultipartFile file) throws IOException {
        String url = s3ImageService.upload(file);
        return ApiResponse.ok(Map.of("url", url));
    }
}
