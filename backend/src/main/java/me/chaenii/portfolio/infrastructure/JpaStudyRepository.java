package me.chaenii.portfolio.infrastructure;

import me.chaenii.portfolio.domain.Study;
import me.chaenii.portfolio.domain.StudyRepository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JpaStudyRepository extends JpaRepository<Study, Long>, StudyRepository {

    @Override
    List<Study> findAllByOrderBySortOrderAsc();
}
