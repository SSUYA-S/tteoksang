package com.welcome.tteoksang.game.exhandler;

import com.welcome.tteoksang.game.exception.*;
import com.welcome.tteoksang.user.exception.TitleNotExistException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = {"com.welcome.tteoksang.game.controller"})
public class GameExceptionHandler {

  private void makeErrorMessage(StringBuilder errorMessage, Exception e) {
    StackTraceElement[] stackTrace = e.getStackTrace();

    if (stackTrace.length > 0) {
      StackTraceElement topFrame = stackTrace[0];
      String className = topFrame.getClassName();
      String methodName = topFrame.getMethodName();

      errorMessage.append(className).append(".").append(methodName).append(": ");
    }
  }

  @ExceptionHandler(WebSocketIdNotExistException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  protected ResponseEntity<String> webSocketIdNotExistsExceptionHandler(
      WebSocketIdNotExistException e) {
    StringBuilder errorMessage = new StringBuilder();

    makeErrorMessage(errorMessage, e);

    errorMessage.append("웹소켓 아이디가 존재하지 않습니다.");
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }

  @ExceptionHandler(TitleNotExistException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  protected ResponseEntity<String> titleNotExistExceptionHandler(TitleNotExistException e) {
    StringBuilder errorMessage = new StringBuilder();

    makeErrorMessage(errorMessage, e);

    errorMessage.append("존재하지 않는 칭호입니다.");
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }

  @ExceptionHandler(WarehouseNotExistException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  protected ResponseEntity<String> warehouseNotExistsExceptionHandler(
          WarehouseNotExistException e) {
    StringBuilder errorMessage = new StringBuilder();

    makeErrorMessage(errorMessage, e);

    errorMessage.append("없는 창고 입니다.");
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }

  @ExceptionHandler(BrokerNotExistException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  protected ResponseEntity<String> brokerNotExistsExceptionHandler(
          BrokerNotExistException e) {
    StringBuilder errorMessage = new StringBuilder();

    makeErrorMessage(errorMessage, e);

    errorMessage.append("없는 교환소 입니다.");
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }

  @ExceptionHandler(VehicleNotExistException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  protected ResponseEntity<String> vehicleNotExistsExceptionHandler(
          VehicleNotExistException e) {
    StringBuilder errorMessage = new StringBuilder();

    makeErrorMessage(errorMessage, e);

    errorMessage.append("없는 운송수단 입니다.");
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }

  @ExceptionHandler(PurchaseException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  protected ResponseEntity<String> purchaseExceptionHandler(
          PurchaseException e) {
    StringBuilder errorMessage = new StringBuilder();

    makeErrorMessage(errorMessage, e);

    errorMessage.append("구매 오류 입니다.");
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }

  @ExceptionHandler(GameInfoNotFoundException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  protected ResponseEntity<String> gameInfoNotExistsExceptionHandler(
          GameInfoNotFoundException e) {
    StringBuilder errorMessage = new StringBuilder();

    makeErrorMessage(errorMessage, e);

    errorMessage.append("게임 정보가 없습니다.");
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }
}
