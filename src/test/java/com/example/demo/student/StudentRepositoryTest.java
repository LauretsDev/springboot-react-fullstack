package com.example.demo.student;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
class StudentRepositoryTest {

    @Autowired
    private StudentRepository studentRepositoryTest;

    @AfterEach
    void tearDown() {
        studentRepositoryTest.deleteAll();
    }

    @Test
    void itShouldCheckIfStudentEmailExists() {
        // give
        Student student = new Student("Diego", "diego@gmail.com", Gender.MALE);
        studentRepositoryTest.save(student);

        // when
        boolean expected = studentRepositoryTest.selectExistsEmail(student.getEmail());

        // then
        assertThat(expected).isTrue();
    }

    @Test
    void itShouldCheckIfStudentEmailDoesNotExist() {
        // give
        Student student = new Student("Diego", "diego@gmail.com", Gender.MALE);

        // when
        boolean expected = studentRepositoryTest.selectExistsEmail(student.getEmail());

        // then
        assertThat(expected).isFalse();
    }
}