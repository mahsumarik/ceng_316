package com.iztech.gsmBackend.service.Impl;

import com.iztech.gsmBackend.dto.FacultyStatusDto;
import com.iztech.gsmBackend.dto.StudentDto;
import com.iztech.gsmBackend.enums.STATUS;
import com.iztech.gsmBackend.model.Dean;
import com.iztech.gsmBackend.model.Student;
import com.iztech.gsmBackend.model.StudentList;
import com.iztech.gsmBackend.repository.IDeanRepository;
import com.iztech.gsmBackend.repository.IStudentListRepository;
import com.iztech.gsmBackend.repository.IStudentAffairRepository;
import com.iztech.gsmBackend.service.IStudentAffairService;
import com.iztech.gsmBackend.service.INotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentAffairService implements IStudentAffairService {

    @Autowired
    private IStudentListRepository studentListRepository;
    @Autowired
    private IStudentAffairRepository studentAffairRepository;
    @Autowired
    private INotificationService notificationService;
    @Autowired
    private IDeanRepository deanRepository;

    @Override
    public List<FacultyStatusDto> getFacultyStatuses() {
        List<Dean> deans = deanRepository.findAll();
        List<String> uniqueFaculties = deans.stream().map(Dean::getFaculty).distinct().collect(Collectors.toList());
        return uniqueFaculties.stream().map(facultyName -> {
            // O fakülteye ait dean'i bul
            Dean dean = deans.stream().filter(d -> facultyName.equalsIgnoreCase(d.getFaculty())).findFirst().orElse(null);
            boolean hasSent = dean != null && !studentListRepository.findByDeanIdAndStudentAffairIsNotNull(dean.getId()).isEmpty();
            FacultyStatusDto dto = new FacultyStatusDto();
            dto.setFacultyId(dean != null ? dean.getId() : null);
            dto.setName(facultyName);
            dto.setStatus(hasSent ? "SENT" : "PENDING");
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public void sendReminderToDean(Long deanId) {
        boolean alreadySent = !studentListRepository.findByDeanIdAndStudentAffairIsNotNull(deanId).isEmpty();
        if (alreadySent) {
            throw new IllegalStateException("Student list already sent by dean.");
        }
        String message = "Please send your approved student list to Student Affairs.";
        notificationService.sendNotification(deanId, message);
    }

    @Override
    public List<StudentDto> getApprovedStudentsForStudentAffair(Long studentAffairId) {
        List<StudentList> lists = studentListRepository.findByStudentAffairId(studentAffairId);
        return lists.stream()
                .flatMap(list -> list.getStudents().stream())
                .filter(student -> student.getDeanStatus() == STATUS.APPROVED)
                .map(student -> {
                    StudentDto dto = new StudentDto();
                    dto.setId(student.getId());
                    dto.setFirstName(student.getFirstName());
                    dto.setLastName(student.getLastName());
                    dto.setGpa(student.getGpa());
                    dto.setStudentNumber(student.getStudentNumber());
                    dto.setDepartment(student.getDepartment());
                    dto.setFaculty(student.getFaculty());
                    dto.setEctsEarned(student.getEctsEarned());
                    dto.setAdvisorStatus(student.getAdvisorStatus() != null ? student.getAdvisorStatus().name() : "PENDING");
                    dto.setSecretaryStatus(student.getSecretaryStatus() != null ? student.getSecretaryStatus().name() : "PENDING");
                    dto.setDeanStatus(student.getDeanStatus() != null ? student.getDeanStatus().name() : "PENDING");
                    dto.setStudentAffairStatus(student.getStudentAffairStatus() != null ? student.getStudentAffairStatus().name() : "PENDING");
                    return dto;
                })
                .distinct()
                .collect(Collectors.toList());
    }
}
