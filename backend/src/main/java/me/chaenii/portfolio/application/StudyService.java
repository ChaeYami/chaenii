package me.chaenii.portfolio.application;

import me.chaenii.portfolio.application.dto.StudyRequest;
import me.chaenii.portfolio.application.dto.StudyResponse;
import me.chaenii.portfolio.domain.DomainException;
import me.chaenii.portfolio.domain.Study;
import me.chaenii.portfolio.domain.StudyRepository;
import me.chaenii.portfolio.presentation.ErrorCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class StudyService {

    private final StudyRepository studyRepository;

    public StudyService(StudyRepository studyRepository) {
        this.studyRepository = studyRepository;
    }

    public List<StudyResponse> getStudies() {
        return studyRepository.findAllByOrderBySortOrderAsc()
                .stream().map(StudyResponse::from).toList();
    }

    @Transactional
    public StudyResponse create(StudyRequest request) {
        Study study = Study.create(
                request.title(), request.description(),
                request.imageUrl(), request.notionUrl(), request.tags()
        );
        return StudyResponse.from(studyRepository.save(study));
    }

    @Transactional
    public StudyResponse update(Long id, StudyRequest request) {
        Study study = findOrThrow(id);
        study.update(request.title(), request.description(),
                request.imageUrl(), request.notionUrl(), request.tags());
        return StudyResponse.from(study);
    }

    @Transactional
    public void delete(Long id) {
        Study study = findOrThrow(id);
        studyRepository.delete(study);
    }

    @Transactional
    public void reorder(List<Long> ids) {
        for (int i = 0; i < ids.size(); i++) {
            Study study = findOrThrow(ids.get(i));
            study.updateSortOrder(i);
        }
    }

    private Study findOrThrow(Long id) {
        return studyRepository.findById(id)
                .orElseThrow(() -> new DomainException(ErrorCode.P001));
    }
}
