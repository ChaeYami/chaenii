package me.chaenii.portfolio.application;

import me.chaenii.portfolio.application.dto.*;
import me.chaenii.portfolio.domain.DomainException;
import me.chaenii.portfolio.domain.Guestbook;
import me.chaenii.portfolio.domain.GuestbookRepository;
import me.chaenii.portfolio.infrastructure.spam.SpamDetector;
import me.chaenii.portfolio.presentation.ErrorCode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class GuestbookService {

    private final GuestbookRepository guestbookRepository;

    public GuestbookService(GuestbookRepository guestbookRepository) {
        this.guestbookRepository = guestbookRepository;
    }

    public Page<GuestbookResponse> getEntries(Pageable pageable) {
        return guestbookRepository.findByHiddenFalse(pageable)
                .map(GuestbookResponse::from);
    }

    @Transactional
    public GuestbookResponse create(GuestbookRequest request) {
        // 하니팟이 채워졌으면 폼을 긁은 봇 → 거부
        if (request.website() != null && !request.website().isBlank()) {
            throw new DomainException(ErrorCode.G001, "등록할 수 없는 요청입니다.");
        }
        if (SpamDetector.isSpam(request.nickname(), request.content())) {
            throw new DomainException(ErrorCode.G001, "스팸으로 의심되는 내용은 등록할 수 없어요.");
        }

        Guestbook guestbook = Guestbook.create(
                request.nickname(),
                request.content(),
                request.password()
        );
        return GuestbookResponse.from(guestbookRepository.save(guestbook));
    }

    @Transactional
    public void delete(Long id, GuestbookDeleteRequest request) {
        Guestbook guestbook = findOrThrow(id);
        guestbook.validateOwnership(request.password());
        guestbookRepository.delete(guestbook);
    }

    @Transactional
    public GuestbookResponse addReply(Long id, ReplyRequest request) {
        Guestbook guestbook = findOrThrow(id);
        guestbook.addReply(request.content());
        return GuestbookResponse.from(guestbook);
    }

    @Transactional
    public void removeReply(Long id) {
        Guestbook guestbook = findOrThrow(id);
        guestbook.removeReply();
    }

    @Transactional
    public void hide(Long id) {
        Guestbook guestbook = findOrThrow(id);
        guestbook.hide();
    }

    private Guestbook findOrThrow(Long id) {
        return guestbookRepository.findById(id)
                .orElseThrow(() -> new DomainException(ErrorCode.C002));
    }
}
