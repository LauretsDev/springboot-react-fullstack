package com.example.demo.student;

import com.example.demo.student.exception.BadRequestException;
import com.example.demo.student.exception.StudentNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;
    private StudentService studentServiceTest;

    @BeforeEach
    void setUp() {
        studentServiceTest = new StudentService(studentRepository);
    }

    @Test
    void canGetAllStudents() {
        // when
        studentServiceTest.getAllStudents();

        // then
        verify(studentRepository).findAll();
    }

    @Test
    void canAddStudent() {
        // given
        Student student = new Student("Diego", "diego@gmail.com", Gender.MALE);

        // when
        studentServiceTest.addStudent(student);

        // then
        ArgumentCaptor<Student> argumentCaptor = ArgumentCaptor.forClass(Student.class);

        verify(studentRepository).save(argumentCaptor.capture());

        Student capturedStudent = argumentCaptor.getValue();

        assertThat(capturedStudent).isEqualTo(student);
    }

    @Test
    void willThrowWhenEmailIsTaken() {
        // given
        Student student = new Student("Diego", "diego@gmail.com", Gender.MALE);

        given(studentRepository.selectExistsEmail(anyString()))
                .willReturn(true);
        // when
        // then
        assertThatThrownBy(() -> studentServiceTest.addStudent(student))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Email " + student.getEmail() + " is already taken");

        verify(studentRepository, never()).save(any());

    }

    @Test
    void canDeleteStudent() {
        // given
        Long id = 1L;

        // when
        given(studentRepository.existsById(anyLong()))
                .willReturn(true);

        studentServiceTest.removeStudent(id);

        // then
        ArgumentCaptor<Long> argumentCaptor = ArgumentCaptor.forClass(Long.class);

        verify(studentRepository).deleteById(argumentCaptor.capture());

        Long capturedId = argumentCaptor.getValue();

        assertThat(capturedId).isEqualTo(id);

        verify(studentRepository).deleteById(id);

    }

    @Test
    void willThrowWHenDeleteStudentNotFound() {
        // given
        Long id = 1L;

        // when
        given(studentRepository.existsById(anyLong()))
                .willReturn(false);

        // then
        assertThatThrownBy(() -> studentServiceTest.removeStudent(id))
                .isInstanceOf(StudentNotFoundException.class)
                .hasMessageContaining("Student with id " + id + " does not exist");

        verify(studentRepository, never()).deleteById(any());

    }
}