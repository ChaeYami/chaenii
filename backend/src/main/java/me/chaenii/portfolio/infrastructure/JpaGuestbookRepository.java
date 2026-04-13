package me.chaenii.portfolio.infrastructure;

import me.chaenii.portfolio.domain.Guestbook;
import me.chaenii.portfolio.domain.GuestbookRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaGuestbookRepository extends JpaRepository<Guestbook, Long>, GuestbookRepository {

    @Override
    Page<Guestbook> findByHiddenFalse(Pageable pageable);
}
