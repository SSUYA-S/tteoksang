package com.welcome.tteoksang;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class TteoksangApplication {

  public static void main(String[] args) {
    SpringApplication.run(TteoksangApplication.class, args);
  }

}
