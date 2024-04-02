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

        public void reduce(Text key, Iterable<Text> values, Context context) throws IOException, InterruptedException {

            // 새로운 반기 객체 생성
            ReduceStatistics reduceStatistics = new ReduceStatistics();
            // 각각의 ReduceProductInfo를 관리하기 위한 맵 초기화
            reduceStatistics.setReduceProductInfoMap(new HashMap<>());
            // game 접속 시간대 계산을 위한
            int[] gamePlayCount = new int[8];
            for (int i=0; i<=56; i++) {
                ReduceProductInfo reduceProductInfo = new ReduceProductInfo();
                // productKey 별로 key값 할당
                reduceStatistics.getReduceProductInfoMap().put((long) i, reduceProductInfo);
            }

            // 입력값을 순회하며 반기 객체에 데이터 추가
            for (Text value : values) {
                ObjectMapper mapper = new ObjectMapper();
                try {
                    // Json 형태의 문자열을 Statistics 객체로 변환 -> 개인것의 저장을 그렇게 했으니까
                    Statistics statistics = mapper.readValue(value.toString(), Statistics.class);

                    int accPrivateOnlineTimeSlotCount = statistics.getAccPrivateOnlineTimeSlotCount();
                    // ProductInfo 값이 필요하지 않은 통계값
                    reduceStatistics.setAccPrivateRentFee(reduceStatistics.getAccPrivateRentFee() + statistics.getAccPrivateRentFee());
                    reduceStatistics.setTotalAccPrivateProductIncome(reduceStatistics.getTotalAccPrivateProductIncome() + statistics.getAccPrivateRentFee());
                    reduceStatistics.setAccPrivateUpgradeFee(reduceStatistics.getAccPrivateUpgradeFee() + statistics.getAccPrivateUpgradeFee());
                    reduceStatistics.setAccPrivateEventBonus(reduceStatistics.getAccPrivateEventBonus() + statistics.getAccPrivateEventBonus());
                    reduceStatistics.setAccPrivatePlayTime(reduceStatistics.getAccPrivatePlayTime() + statistics.getAccPrivatePlayTime());
                    int[] onlineTimeSlotCount = reduceStatistics.getAccPrivateOnlineTimeSlotCount();
                    onlineTimeSlotCount[accPrivateOnlineTimeSlotCount] += 1;
                    reduceStatistics.setAccPrivateOnlineTimeSlotCount(onlineTimeSlotCount);
                    reduceStatistics.setAccPrivateGamePlayCount(reduceStatistics.getAccPrivateGamePlayCount() + 1);
                    // 개인 이벤트는 일단 생략

                    // ProductInfo 변수
                    for (Map.Entry<Long, ProductInfo> entry : statistics.getProductInfoMap().entrySet()) {
                        Long productId = entry.getKey();
                        ProductInfo productInfo = entry.getValue();

                        // ReduceStatistics ReduceProductInfo 객체 가져오기
                        ReduceProductInfo reduceProductInfo = reduceStatistics.getReduceProductInfoMap().getOrDefault(productId, new ReduceProductInfo());
                        // 기존 값에 원하는 값 업데이트
                        reduceProductInfo.setAccPrivateProductPurchaseQuantity(reduceProductInfo.getAccPrivateProductPurchaseQuantity() + productInfo.getAccPrivateProductPurchaseQuantity());
                        reduceProductInfo.setMaxPrivateProductPurchaseQuantity(Math.max(reduceProductInfo.getMaxPrivateProductPurchaseQuantity(), productInfo.getMaxPrivateProductPurchaseQuantity()));
                        reduceProductInfo.setAccPrivateProductOutcome(reduceProductInfo.getAccPrivateProductOutcome() + productInfo.getAccPrivateProductOutcome());
                        reduceProductInfo.setAccPrivateProductSalesQuantity(reduceProductInfo.getAccPrivateProductSalesQuantity() + productInfo.getAccPrivateProductSalesQuantity());
                        reduceProductInfo.setMaxPrivateProductSalesQuantity(Math.max(reduceProductInfo.getMaxPrivateProductSalesQuantity(), productInfo.getMaxPrivateProductSalesQuantity()));
                        reduceProductInfo.setAccPrivateProductIncome(reduceProductInfo.getAccPrivateProductIncome() + productInfo.getAccPrivateProductIncome());
                        reduceProductInfo.setAccPrivateProductProfit(reduceProductInfo.getAccPrivateProductProfit() + productInfo.getAccPrivateProductProfit());
                        reduceProductInfo.setMaxPrivateProductProfit(Math.max(reduceProductInfo.getMaxPrivateProductProfit(), productInfo.getMaxPrivateProductProfit()));
                        reduceProductInfo.setMaxPrivateProductHoldingQuantity(Math.max(reduceProductInfo.getMaxPrivateProductHoldingQuantity(), productInfo.getMaxPrivateProductHoldingQuantity()));
                        reduceProductInfo.setMaxPrivateProductPurchaseCost(Math.max(reduceProductInfo.getMaxPrivateProductPurchaseCost(), productInfo.getMaxPrivateProductPurchaseCost()));
                        reduceProductInfo.setMinPrivateProductPurchaseCost(Math.min(reduceProductInfo.getMinPrivateProductPurchaseCost(), productInfo.getMinPrivateProductPurchaseCost()));
                        reduceProductInfo.setMaxPrivateProductSalesCost(Math.max(reduceProductInfo.getMaxPrivateProductSalesCost(), productInfo.getMaxPrivateProductSalesCost()));
                        reduceProductInfo.setMinPrivateProductSalesCost(Math.min(reduceProductInfo.getMinPrivateProductSalesCost(), productInfo.getMinPrivateProductSalesCost()));
                        reduceProductInfo.setAccPrivateBrokerFee(reduceProductInfo.getAccPrivateBrokerFee() + productInfo.getAccPrivateBrokerFee());

                        // ReduceStatistics 중 productInfo 값이 필요한 것 확인
                        reduceStatistics.setTotalAccPrivateBrokerFee(reduceStatistics.getTotalAccPrivateBrokerFee() + productInfo.getAccPrivateBrokerFee());
                        reduceStatistics.setTotalAccPrivateProductIncome(reduceStatistics.getTotalAccPrivateProductIncome() + productInfo.getAccPrivateProductIncome());
                        reduceStatistics.setTotalAccPrivateProductOutcome(reduceStatistics.getTotalAccPrivateProductOutcome() + productInfo.getAccPrivateProductOutcome());
                        reduceStatistics.setTotalAccPrivateProductProfit(reduceStatistics.getTotalAccPrivateProductProfit() + productInfo.getAccPrivateProductProfit());
                        // 밑에 큰 손 어떻게 할건지??
                        reduceStatistics.setMaxPrivateProductOutcome(Math.max(reduceStatistics.getMaxPrivateProductOutcome(), productInfo.getAccPrivateProductOutcome()));

                        // reduceProductInfo 값을 저장
                        reduceStatistics.getReduceProductInfoMap().put((long) productId, reduceProductInfo);
                    }

                    // ReduceProductInfo 객체를 갱신하거나 생성해 ReduceStatistics에 추가
//                    for (Map.Entry<Long, ReduceProductInfo> entry : mapper.getRed)
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            // ReduceStatistics 객체를 Json 형태의 문자열로 반환하여 출력
            ObjectMapper mapper = new ObjectMapper();
            String outputValue = mapper.writeValueAsString(reduceStatistics);
            context.write(key, new Text(outputValue));

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
            statistics.setAccPrivateGamePlayCount(500);
//            Statistics statistics = new Statistics();
//            String outputValue = mapper.writeValueAsString(statistics);
//            System.out.println(outputValue);

//            ProductInfo productInfo = new ProductInfo();
            //productInfo.setAccPrivateBrokerFee(19204L);
            // Statistics 객체에 ProductInfo를 추가
            //statistics.getProductInfoMap().put(productId, productInfo);

            String outputValue = mapper.writeValueAsString(statistics);
            System.out.println(outputValue);


            ReduceStatistics reduceStatistics = new ReduceStatistics();
            Statistics secstatistics = mapper.readValue(outputValue.toString(), Statistics.class);
            reduceStatistics.setAccPrivateUpgradeFee(secstatistics.getAccPrivateRentFee());
            reduceStatistics.setAccPrivateGamePlayCount(secstatistics.getAccPrivateGamePlayCount());
            reduceStatistics.setAccPrivatePlayTime(200);
            for (int i=0; i<=56; i++) {
                ReduceProductInfo reduceProductInfo = new ReduceProductInfo();
                // key값 할당
                reduceStatistics.getReduceProductInfoMap().put((long) i, reduceProductInfo);
            }
            String secoutputValue = mapper.writeValueAsString(reduceStatistics);
            System.out.println(secoutputValue);


            switch (logType){
                case "BUY":
                    System.out.println("쌰아 이게 맞나");
                    break;
            }

        } catch (Exception e) {

        }


        // 진짜 Main 함수 시작
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