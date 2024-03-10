package com.welcome.tteoksang.auth.exhandler;

import com.welcome.tteoksang.auth.exception.*;
import java.security.NoSuchAlgorithmException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = {"com.welcome.tteoksang.auth.controller"})
public class AuthExceptionHandler {

  private void makeErrorMessage(StringBuilder errorMessage, Exception e) {
    StackTraceElement[] stackTrace = e.getStackTrace();

    if (stackTrace.length > 0) {
      StackTraceElement topFrame = stackTrace[0];
      String className = topFrame.getClassName();
      String methodName = topFrame.getMethodName();

      errorMessage.append(className).append(".").append(methodName).append(": ");
    }
  }

  @ExceptionHandler(EmailAlreadyExistsException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  protected ResponseEntity<String> emailAlreadyExistsExceptionHandler(
      EmailAlreadyExistsException e) {
    StringBuilder errorMessage = new StringBuilder();

    makeErrorMessage(errorMessage, e);

    errorMessage.append("이미 존재하는 이메일입니다.");
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }
}
