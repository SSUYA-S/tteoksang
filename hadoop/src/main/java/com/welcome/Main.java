package com.welcome;


import com.fasterxml.jackson.databind.ObjectMapper;

public class Main {
    public static void main(String[] args) {

        System.out.println("Hello world!");
        String val = "{\n" +
                "    \"type\": \"BUY\",\n" +
                "    \"body\": {\n" +
                "        \"userId\" : \"asdffw-qwerqw\",\n" +
                "        \"gameId\": 1,\n" +
                "        \"turn\": 12,\n" +
                "        \"productId\": 8,\n" +
                "        \"purchasedQuantity\": 12,\n" +
                "        \"productOutcome\": 123,\n" +
                "        \"productQuantity\": 11,\n" +
                "        \"productCost\": 130\n" +
                "    }\n" +
                "}";
        System.out.println(val);
        ObjectMapper mapper = new ObjectMapper();
        try {
            Message message = mapper.readValue(val.toString(), Message.class);
            System.out.println(message.getClass().getName());
            System.out.println(message.getType());
            System.out.println(message.getBody());

        } catch (Exception e){

        }
    }
}