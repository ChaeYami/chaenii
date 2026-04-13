package me.chaenii.portfolio.presentation;

import jakarta.validation.Valid;
import me.chaenii.portfolio.application.GuestbookService;
import me.chaenii.portfolio.application.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/guestbook")
public class GuestbookController {

    private final GuestbookService guestbookService;

    public GuestbookController(GuestbookService guestbookService) {
        this.guestbookService = guestbookService;
    }

    @GetMapping
    public ApiResponse<Page<GuestbookResponse>> list(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable
    ) {
        return ApiResponse.ok(guestbookService.getEntries(pageable));
    }

    @PostMapping
    public ApiResponse<GuestbookResponse> create(@Valid @RequestBody GuestbookRequest request) {
        return ApiResponse.ok(guestbookService.create(request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id, @Valid @RequestBody GuestbookDeleteRequest request) {
        guestbookService.delete(id, request);
        return ApiResponse.ok();
    }

    @PostMapping("/{id}/reply")
    public ApiResponse<GuestbookResponse> addReply(@PathVariable Long id, @Valid @RequestBody ReplyRequest request) {
        return ApiResponse.ok(guestbookService.addReply(id, request));
    }

    @DeleteMapping("/{id}/reply")
    public ApiResponse<Void> removeReply(@PathVariable Long id) {
        guestbookService.removeReply(id);
        return ApiResponse.ok();
    }

    @PatchMapping("/{id}/hide")
    public ApiResponse<Void> hide(@PathVariable Long id) {
        guestbookService.hide(id);
        return ApiResponse.ok();
    }
}
