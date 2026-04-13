package me.chaenii.portfolio.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface GuestbookRepository {

    Guestbook save(Guestbook guestbook);

    Optional<Guestbook> findById(Long id);

    Page<Guestbook> findByHiddenFalse(Pageable pageable);

    void delete(Guestbook guestbook);
}
