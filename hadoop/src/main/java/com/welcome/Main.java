package com.welcome;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.util.GenericOptionsParser;

import java.io.IOException;
import java.util.StringTokenizer;

public class Main {

    // map function
    public static class LogFilter extends Mapper<Object, Text, Object, Text> {

        private final static IntWritable one = new IntWritable(1);
        // json parser 설정

        //private final JSONParser
        //private final JSONParser jsonParser = new JSONParser();

        public void map(Object key, Text value, Context context) throws IOException, InterruptedException {
            // 각 라인을 읽어들여서 토큰화
            StringTokenizer itr = new StringTokenizer(value.toString());
            org.codehaus.jackson.map.ObjectMapper mapper = new org.codehaus.jackson.map.ObjectMapper();
            try{
                // JSON 텍스트를 파싱해서 JSON 객체로 변환
                //JSONObject jsonObject = (JSONObject) jsonParser.parse(value.toString());

                // JSON 형식의 텍스트를 Java 객체로 변환 -> type과 body
                Message message = mapper.readValue(value.toString(), Message.class);
                System.out.println(message.getType());
                System.out.println(message.getBody());
            } catch (Exception e) {
                e.printStackTrace();
            }


        }
    }


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
        //System.out.println(val);
        ObjectMapper mapper = new ObjectMapper();
        try {
            Message message = mapper.readValue(val.toString(), Message.class);
            String logType = message.getType();
            System.out.println(logType);

        } catch (Exception e){

        }

        Configuration conf = new Configuration();
        try {
            String[] otherArgs = new GenericOptionsParser(conf, args).getRemainingArgs();
            if (otherArgs.length != 2) {
                System.err.println("Usage: <in> <out>");
                System.exit(2);
            }
            Job job = new Job(conf, "log filtering");

        } catch (Exception e){

        }
    }
}