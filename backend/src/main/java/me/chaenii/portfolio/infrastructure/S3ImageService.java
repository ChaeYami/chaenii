package me.chaenii.portfolio.infrastructure;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
public class S3ImageService {

    private final S3Client s3Client;
    private final String bucket;
    private final String prefix;
    private final String region;

    public S3ImageService(
            @Value("${s3.bucket}") String bucket,
            @Value("${s3.region:ap-northeast-2}") String region,
            @Value("${s3.uploads-prefix:uploads}") String prefix
    ) {
        this.bucket = bucket;
        this.region = region;
        this.prefix = prefix;
        this.s3Client = S3Client.builder()
                .region(Region.of(region))
                .build();
    }

    public String upload(MultipartFile file) throws IOException {
        String ext = getExtension(file.getOriginalFilename());
        String key = prefix + "/" + UUID.randomUUID() + ext;

        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucket)
                        .key(key)
                        .contentType(file.getContentType())
                        .build(),
                RequestBody.fromBytes(file.getBytes())
        );

        return "https://" + bucket + ".s3." + region + ".amazonaws.com/" + key;
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return "." + filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }
}
