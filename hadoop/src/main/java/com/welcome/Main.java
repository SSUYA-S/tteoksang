package com.welcome;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.StringTokenizer;

public class Main {

    // map function
    public static class LogMapper extends Mapper<Object, Text, Text, Text> {

        private final static IntWritable one = new IntWritable(1);
        public void map(Object key, Text value, Context context) throws IOException, InterruptedException {

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
                long productCost;

                switch (logType) {
                    case "BUY": // 구매
                        productId = Long.parseLong(bodyMap.get("productId").toString());
                        long purchasedQuantity = Long.parseLong(bodyMap.get("purchasedQuantity").toString());
                        long productOutcome = Long.parseLong(bodyMap.get("productOutcome").toString());
                        long productQuantity = Long.parseLong(bodyMap.get("productQuantity").toString());
                        productCost = Long.parseLong(bodyMap.get("productCost").toString());
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
                    case "SELL":    // 판매
                        productId = Long.parseLong(bodyMap.get("productId").toString());
                        long productIncome = Long.parseLong(bodyMap.get("productIncome").toString());
                        long soldQuantity = Long.parseLong(bodyMap.get("soldQuantity").toString());
                        long brokerFee = Long.parseLong(bodyMap.get("brokerFee").toString());
                        long productProfit = Long.parseLong(bodyMap.get("productProfit").toString());
                        productCost = Long.parseLong(bodyMap.get("productCost").toString());
                        // ProductInfo가 있을 경우 먼저 추가 후 statistics 추가
                        productInfo = new ProductInfo();
                        productInfo.setAccPrivateProductSalesQuantity(soldQuantity);
                        productInfo.setMaxPrivateProductSalesQuantity(soldQuantity);
                        productInfo.setAccPrivateProductIncome(productIncome);
                        productInfo.setAccPrivateProductProfit(productProfit);
                        productInfo.setMaxPrivateProductProfit(productProfit);
                        productInfo.setMaxPrivateProductSalesCost(productCost);
                        productInfo.setMinPrivateProductSalesCost(productCost);
                        productInfo.setAccPrivateBrokerFee(brokerFee);
                        // Statistics에 productInfo 추가
                        statistics.setMaxPrivateProductIncome(productIncome);
                        statistics.getProductInfoMap().put(productId, productInfo);
                        break;
                    case "RENT_FEE":    // 임대료 -> 아직 안되어있습니다아아
                        long rentFee = Long.parseLong(bodyMap.get("rentFee").toString());
                        statistics.setAccPrivateRentFee(rentFee);
                        break;
                    case "UPGRADE": // 업그레이드
                        long upgradeFee = Long.parseLong(bodyMap.get("upgradeFee").toString());
                        statistics.setAccPrivateUpgradeFee(upgradeFee);
                        break;
                    case "PRIVATE_EVENT":   // 개인 이벤트
                        String eventId = bodyMap.get("eventId").toString();
                        statistics.setAccPrivateEventOccurId(eventId);
                        break;
                    case "DISCONNECT":  // 종료
                        int playtime = Integer.parseInt(bodyMap.get("playtime").toString());
                        statistics.setAccPrivatePlayTime(playtime);
                        break;
                    case "CONNECT": // 접속
                        int onlineTimeSlot = Integer.parseInt(bodyMap.get("onlineTimeSlot").toString());
                        statistics.setAccPrivateOnlineTimeSlotCount(onlineTimeSlot);
                        break;
                    case "NEWGAME": // 새 게임 생수
                        statistics.setAccPrivateGamePlayCount(1);
                        break;

                }

                // 리듀스로 보낼 데이터를 JSON 형식으로 변환해 출력값으로 설정
                String outputValue = mapper.writeValueAsString(statistics);

                // 출력
                context.write(new Text(outputKey), new Text(outputValue));

            } catch (Exception e) {
                e.printStackTrace();
            }

        }
    }


    // reduce function
    public static class LogReducer extends Reducer<Text, Text, Text, Text> {

        public void reduce(Text key, Text value, Context context) throws IOException, InterruptedException {
            ObjectMapper mapper = new ObjectMapper();
            try {

            } catch (Exception e) {

            }
        }
    }

    public static void main(String[] args) {

//        Map<Long, Statistics> statisticsMap = new HashMap<>();
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
                "        \"rentFee\": 130\n" +
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
//            statistics.getProductInfoMap().put(productId, productInfo);
            int gameId = Integer.parseInt(bodyMap.get("gameId").toString());
            System.out.println("밑에가 json형식으로 나와야 하는데 말이지요?");
            long rentFee = Long.parseLong(bodyMap.get("rentFee").toString());
            statistics.setAccPrivateRentFee(rentFee);
//            Statistics statistics = new Statistics();
//            String outputValue = mapper.writeValueAsString(statistics);
//            System.out.println(outputValue);

//            ProductInfo productInfo = new ProductInfo();
            //productInfo.setAccPrivateBrokerFee(19204L);
            // Statistics 객체에 ProductInfo를 추가
            //statistics.getProductInfoMap().put(productId, productInfo);
            String outputValue = mapper.writeValueAsString(statistics);
            System.out.println(outputValue);
            switch (logType){
                case "BUY":
                    System.out.println("쌰아 이게 맞나");
                    break;
            }

        } catch (Exception e) {

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