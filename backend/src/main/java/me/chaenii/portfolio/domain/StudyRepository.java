package me.chaenii.portfolio.domain;

import java.util.List;
import java.util.Optional;

public interface StudyRepository {
    Study save(Study study);
    Optional<Study> findById(Long id);
    List<Study> findAllByOrderBySortOrderAsc();
    void delete(Study study);
}
