package com.welcome;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.StringTokenizer;

public class Main {

    // map function
    public static class LogFilter extends Mapper<Object, Text, Text, Text> {

        private final static IntWritable one = new IntWritable(1);
        private Map<Long, Statistics> statisticsMap = new HashMap<>();
        public void map(Object key, Text value, Context context) throws IOException, InterruptedException {
            // 각 라인을 읽어들여서 토큰화
            StringTokenizer itr = new StringTokenizer(value.toString());
            ObjectMapper mapper = new ObjectMapper();

            try{
                // JSON 형식의 텍스트를 Java 객체로 변환 -> type과 body
                Message message = mapper.readValue(value.toString(), Message.class);

                // body 내에 있는 userId와 gameId 가져오기
                Map<String, Object> bodyMap = (Map<String, Object>) message.getBody();
                String userId = bodyMap.get("userId").toString();
                int gameId = Integer.parseInt(bodyMap.get("gameId").toString());
                String outputKey = userId + "::" + gameId;

                String logType = message.getType(); // 어떤 타입인지 받아오기

                // 유저의 아이디와 게임 아이디로 리듀스에 사용될 아이디 설정
                Map<String, Object> reducerId = new HashMap<>();

                // statistics 객체를 가져오거나 생성해 맵에 추가
                Statistics statistics = new Statistics();

                Long productId;
                ProductInfo productInfo;

                switch (logType) {
                    case "BUY": // 구매의 경우
                        productId = Long.parseLong(bodyMap.get("productId").toString());
                        Long purchasedQuantity = Long.parseLong(bodyMap.get("purchasedQuantity").toString());
                        Long productOutcome = Long.parseLong(bodyMap.get("productOutcome").toString());
                        Long productQuantity = Long.parseLong(bodyMap.get("productQuantity").toString());
                        Long productCost = Long.parseLong(bodyMap.get("productCost").toString());
                        // ProductInfo가 있을 경우 먼저 추가 후 statistics 추가
                        productInfo = new ProductInfo();
                        productInfo.setAccPrivateProductPurchaseQuantity(purchasedQuantity);
                        productInfo.setMaxPrivateProductPurchaseQuantity(purchasedQuantity);
                        productInfo.setAccPrivateProductOutcome(productOutcome);
                        productInfo.setMaxPrivateProductHoldingQuantity(productQuantity);
                        productInfo.setMaxPrivateProductPurchaseCost(productCost);
                        productInfo.setMinPrivateProductPurchaseCost(productCost);
                        // Statistics에 productInfo 추가
                        statistics.getProductInfoMap().put(productId, productInfo);
                        break;
                    case "SELL":
                        productId = Long.parseLong(bodyMap.get("productId").toString());
                        Long productIncome = Long.parseLong(bodyMap.get("productIncome").toString());
                        Long soldQuantity = Long.parseLong(bodyMap.get("soldQuantity").toString());
                        Long borkerFee = Long.parseLong(bodyMap.get("brokerFee").toString());
                        Long productProfit = Long.parseLong(bodyMap.get("productProfit").toString());
                        Long productcost = Long.parseLong(bodyMap.get("productCost").toString());
                        // ProductInfo가 있을 경우 먼저 추가 후 statistics 추가
                        productInfo = new ProductInfo();
                        productInfo.setAccPrivateProductIncome(productIncome);

                }

                // 리듀스로 보낼 데이터
                Map<String, Object> reducerData = new HashMap<>();

                // 리듀스로 보낼 데이터를 JSON 형식으로 변환해 출력값으로 설정
                Text outputValue = new Text(mapper.writeValueAsString(reducerData));

                // 출력
                context.write(new Text(outputKey), outputValue);

            } catch (Exception e) {
                e.printStackTrace();
            }


        }
    }


    public static void main(String[] args) {

        Map<Long, Statistics> statisticsMap = new HashMap<>();
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
        //System.out.println(val);
        ObjectMapper mapper = new ObjectMapper();
        try {
            Message message = mapper.readValue(val.toString(), Message.class);
            String logType = message.getType();
            Object logBody = message.getBody();
            System.out.println("logType");
            System.out.println(message.getBody());
            Map<String, Object> bodyMap = (Map<String, Object>) message.getBody();
            String userId = bodyMap.get("userId").toString();
            System.out.println(userId);


            Statistics statistics = new Statistics();
            Long productId = Long.parseLong(bodyMap.get("productId").toString());
            ProductInfo productInfo = new ProductInfo();
            statistics.getProductInfoMap().put(productId, productInfo);
            int gameId = Integer.parseInt(bodyMap.get("gameId").toString());
            System.out.println("밑에가 json형식으로 나와야 하는데 말이지요?");

//            Statistics statistics = new Statistics();
            statistics.setAccPrivateRentFee(100000L);
//            String outputValue = mapper.writeValueAsString(statistics);
//            System.out.println(outputValue);

//            ProductInfo productInfo = new ProductInfo();
            productInfo.setAccPrivateBrokerFee(19204L);
            // Statistics 객체에 ProductInfo를 추가
            statistics.getProductInfoMap().put(productId, productInfo);
            String outputValue = mapper.writeValueAsString(statistics);
            System.out.println(outputValue);
            switch (logType){
                case "BUY":
                    System.out.println("쌰아 이게 맞나");
                    break;
            }

        } catch (Exception e){

        }

        Configuration conf = new Configuration();
        try {
//            String[] otherArgs = new GenericOptionsParser(conf, args).getRemainingArgs();
//            if (otherArgs.length != 2) {
//                System.out.println("여기는 메인...");
//            }
            Job job = new Job(conf, "log filtering");
            System.out.println("log filtering");

        } catch (Exception e){

        }
    }
}