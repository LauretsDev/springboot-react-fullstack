package com.example.demo;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;


class DemoApplicationTests {

    Calculator calculatorTest = new Calculator();

    @Test
    void itShouldAddTwoNumbers() {
        // given
        int numberA = 20;
        int numberB = 30;

        // when
        int result = calculatorTest.add(numberA, numberB);

        // then
        assertThat(result).isEqualTo(50);
    }

    class Calculator {
        int add(int a, int b) {
            return a + b;
        }
    }

}
