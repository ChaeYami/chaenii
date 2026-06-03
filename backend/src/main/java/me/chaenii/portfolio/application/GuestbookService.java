package me.chaenii.portfolio.application;

import me.chaenii.portfolio.application.dto.*;
import me.chaenii.portfolio.domain.DomainException;
import me.chaenii.portfolio.domain.Guestbook;
import me.chaenii.portfolio.domain.GuestbookRepository;
import me.chaenii.portfolio.infrastructure.spam.SpamDetector;
import me.chaenii.portfolio.presentation.ErrorCode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class GuestbookService {

    private static final Logger log = LoggerFactory.getLogger(GuestbookService.class);

    private final GuestbookRepository guestbookRepository;

    public GuestbookService(GuestbookRepository guestbookRepository) {
        this.guestbookRepository = guestbookRepository;
    }

    public Page<GuestbookResponse> getEntries(Pageable pageable) {
        return guestbookRepository.findByHiddenFalse(pageable)
                .map(GuestbookResponse::from);
    }

    @Transactional
    public GuestbookResponse create(GuestbookRequest request, String clientIp) {
        // 하니팟이 채워졌으면 폼을 긁은 봇 → 거부
        if (request.website() != null && !request.website().isBlank()) {
            log.warn("Guestbook spam blocked (honeypot) ip={} nickname='{}'", clientIp, request.nickname());
            throw new DomainException(ErrorCode.G001, "등록할 수 없는 요청입니다.");
        }
        if (SpamDetector.isSpam(request.nickname(), request.content())) {
            log.warn("Guestbook spam blocked (content) ip={} nickname='{}' content='{}'",
                    clientIp, request.nickname(), request.content());
            throw new DomainException(ErrorCode.G001, "스팸으로 의심되는 내용은 등록할 수 없어요.");
        }

        Guestbook guestbook = Guestbook.create(
                request.nickname(),
                request.content(),
                request.password()
        );
        Guestbook saved = guestbookRepository.save(guestbook);
        log.info("Guestbook created id={} ip={} nickname='{}'", saved.getId(), clientIp, request.nickname());
        return GuestbookResponse.from(saved);
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
