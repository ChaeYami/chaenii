package me.chaenii.portfolio.presentation;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import me.chaenii.portfolio.application.dto.LoginRequest;
import me.chaenii.portfolio.domain.DomainException;
import me.chaenii.portfolio.infrastructure.security.JwtProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtProvider jwtProvider;
    private final String adminUsername;
    private final String adminPassword;

    public AuthController(
            JwtProvider jwtProvider,
            @Value("${spring.security.user.name}") String adminUsername,
            @Value("${spring.security.user.password}") String adminPassword
    ) {
        this.jwtProvider = jwtProvider;
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
    }

    @PostMapping("/login")
    public ApiResponse<Void> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        if (!adminUsername.equals(request.username()) || !adminPassword.equals(request.password())) {
            throw new DomainException(ErrorCode.A001);
        }

        String token = jwtProvider.generateToken(request.username());
        ResponseCookie cookie = ResponseCookie.from("access_token", token)
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/")
                .maxAge(3600)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ApiResponse.ok();
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("access_token", "")
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/")
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ApiResponse.ok();
    }
}
