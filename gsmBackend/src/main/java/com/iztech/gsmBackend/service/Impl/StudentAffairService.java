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
import com.iztech.gsmBackend.repository.IStudentRepository;
import com.iztech.gsmBackend.repository.IDiplomaRepository;
import com.iztech.gsmBackend.service.IStudentAffairService;
import com.iztech.gsmBackend.service.INotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.iztech.gsmBackend.model.Diploma;
import com.iztech.gsmBackend.model.StudentAffair;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

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
    @Autowired
    private IStudentRepository studentRepository;
    @Autowired
    private IDiplomaRepository diplomaRepository;

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
                .sorted((s1, s2) -> Double.compare(s2.getGpa(), s1.getGpa()))
                .collect(Collectors.toList());
    }

    // --- DIPLOMA & STUDENT LIST PDF OPERATIONS ---

    @Override
    public byte[] prepareDiploma(Long studentId, Long studentAffairId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        StudentAffair studentAffair = studentAffairRepository.findById(studentAffairId)
                .orElseThrow(() -> new RuntimeException("StudentAffair not found"));

        // PDF oluştur
        byte[] pdfBytes = generateDiplomaPdf(student, studentAffair);

        // Diploma kaydı oluştur
        Diploma diploma = new Diploma();
        diploma.setStudent(student);
        diploma.setStudentAffair(studentAffair);
        diploma.setContent(pdfBytes);
        diploma.setApproved(true);
        diploma.setCreationDate(java.time.LocalDateTime.now());
        diplomaRepository.save(diploma);

        // Statü güncelle
        student.setStudentAffairStatus(STATUS.APPROVED);
        student.setGraduationStatus(true);
        studentRepository.save(student);
        // Mezuniyet bildirimi gönder
        notificationService.sendNotification(student.getId(), "You are now eligible for graduation.");

        return pdfBytes;
    }

    @Override
    public void cancelDiploma(Long studentId) {
        System.out.println("Cancel diploma called for studentId: " + studentId);
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Diploma diploma = diplomaRepository.findByStudentId(studentId);
        if (diploma != null) {
            // Önce student'dan diploma referansını kaldır
            student.setDiploma(null);
            studentRepository.save(student);
            //System.out.println("Diploma found and will be deleted for studentId: " + studentId);
            diplomaRepository.delete(diploma);
        } else {
            System.out.println("No diploma found for studentId: " + studentId);
        }
        student.setStudentAffairStatus(STATUS.PENDING);
        student.setGraduationStatus(false);
        studentRepository.save(student);
    }

    @Override
    public byte[] getDiplomaPdf(Long studentId) {
        Diploma diploma = diplomaRepository.findByStudentId(studentId);
        if (diploma == null) {
            throw new RuntimeException("Diploma not found for this student.");
        }
        return diploma.getContent();
    }

    @Override
    public byte[] getStudentListPdf(Long studentAffairId) {
        List<StudentList> lists = studentListRepository.findByStudentAffairId(studentAffairId);
        List<Student> students = lists.stream()
                .flatMap(list -> list.getStudents().stream())
                .filter(student -> student.getDeanStatus() == STATUS.APPROVED)
                .distinct()
                .sorted((s1, s2) -> Double.compare(s2.getGpa(), s1.getGpa()))
                .collect(Collectors.toList());
        return generateStudentListPdf(students);
    }

    @Override
    public byte[] getAllDiplomasZip(Long studentAffairId) {
        List<StudentList> lists = studentListRepository.findByStudentAffairId(studentAffairId);
        List<Student> students = lists.stream()
                .flatMap(list -> list.getStudents().stream())
                .filter(student -> student.getDeanStatus() == STATUS.APPROVED && student.getGraduationStatus() != null && student.getGraduationStatus())
                .distinct()
                .collect(Collectors.toList());
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream(); ZipOutputStream zos = new ZipOutputStream(baos)) {
            for (Student student : students) {
                Diploma diploma = diplomaRepository.findByStudentId(student.getId());
                if (diploma != null && diploma.getContent() != null) {
                    String fileName = student.getFirstName() + "_" + student.getLastName() + "_diploma.pdf";
                    zos.putNextEntry(new ZipEntry(fileName));
                    zos.write(diploma.getContent());
                    zos.closeEntry();
                }
            }
            zos.finish();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to create diplomas zip", e);
        }
    }

    // --- PDF HELPER FONKSİYONLARI ---

    private byte[] generateDiplomaPdf(Student student, StudentAffair studentAffair) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4, 50, 50, 50, 50);
            PdfWriter.getInstance(document, baos);
            document.open();

            // Logo ekle
            try {
                String logoPath = "src/main/resources/static/assets/logo.png"; // veya assets altındaki gerçek path
                Image logo = Image.getInstance(logoPath);
                logo.scaleToFit(100, 100);
                logo.setAlignment(Element.ALIGN_CENTER);
                document.add(logo);
            } catch (Exception e) {
                // Logo eklenemezse devam etsin
            }

            // Başlık
            Font titleFont = new Font(Font.FontFamily.HELVETICA, 22, Font.BOLD);
            Paragraph title = new Paragraph("Diploma", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            // Öğrenci bilgileri
            Font infoFont = new Font(Font.FontFamily.HELVETICA, 14, Font.NORMAL);
            document.add(new Paragraph("Name Surname: " + student.getFirstName() + " " + student.getLastName(), infoFont));
            document.add(new Paragraph("Student Number: " + student.getStudentNumber(), infoFont));
            document.add(new Paragraph("GPA: " + student.getGpa(), infoFont));
            document.add(new Paragraph("Department: " + student.getDepartment(), infoFont));
            document.add(new Paragraph("Faculty: " + student.getFaculty(), infoFont));
            document.add(new Paragraph("Date: " + LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")), infoFont));
            document.add(Chunk.NEWLINE);

            // Mezuniyet mesajı
            Font msgFont = new Font(Font.FontFamily.HELVETICA, 16, Font.BOLDITALIC, BaseColor.DARK_GRAY);
            Paragraph msg = new Paragraph("Congratulations! You have successfully graduated.", msgFont);
            msg.setAlignment(Element.ALIGN_CENTER);
            msg.setSpacingBefore(20);
            msg.setSpacingAfter(20);
            document.add(msg);

            // İmzalar
            Font signFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL);
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingBefore(40);

            PdfPCell cell1 = new PdfPCell();
            cell1.setBorder(Rectangle.NO_BORDER);
            cell1.addElement(new Paragraph("Student Affairs", signFont));
            cell1.addElement(new Paragraph(studentAffair.getFirstName() + " " + studentAffair.getLastName(), signFont));
            cell1.addElement(new Paragraph("Signature: _______________", signFont));

            PdfPCell cell2 = new PdfPCell();
            cell2.setBorder(Rectangle.NO_BORDER);
            cell2.addElement(new Paragraph("Rector", signFont));
            cell2.addElement(new Paragraph("YUSUF BARAN", signFont));
            cell2.addElement(new Paragraph("Signature: _______________", signFont));

            table.addCell(cell1);
            table.addCell(cell2);

            document.add(table);

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate diploma PDF", e);
        }
    }

    private byte[] generateStudentListPdf(List<Student> students) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4, 50, 50, 50, 50);
            PdfWriter.getInstance(document, baos);
            document.open();

            Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
            Paragraph title = new Paragraph("Approved Student List", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10);

            Font headerFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
            table.addCell(new PdfPCell(new Phrase("Name Surname", headerFont)));
            table.addCell(new PdfPCell(new Phrase("Student Number", headerFont)));
            table.addCell(new PdfPCell(new Phrase("Department", headerFont)));
            table.addCell(new PdfPCell(new Phrase("Faculty", headerFont)));
            table.addCell(new PdfPCell(new Phrase("GPA", headerFont)));

            Font cellFont = new Font(Font.FontFamily.HELVETICA, 11, Font.NORMAL);

            for (Student s : students) {
                table.addCell(new PdfPCell(new Phrase(s.getFirstName() + " " + s.getLastName(), cellFont)));
                table.addCell(new PdfPCell(new Phrase(s.getStudentNumber(), cellFont)));
                table.addCell(new PdfPCell(new Phrase(s.getDepartment(), cellFont)));
                table.addCell(new PdfPCell(new Phrase(s.getFaculty(), cellFont)));
                table.addCell(new PdfPCell(new Phrase(String.valueOf(s.getGpa()), cellFont)));
            }

            document.add(table);
            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate student list PDF", e);
        }
    }
}
