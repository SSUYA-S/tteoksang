package com.welcome;

import java.io.IOException;
import java.text.ParseException;
import java.util.StringTokenizer;


import com.fasterxml.jackson.core.JsonParser;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;
import org.codehaus.jackson.map.ObjectMapper;


public class Driver {

    // map function
    public static class LogFilter extends Mapper<Object, Text, Object, Text>{

        private final static IntWritable one = new IntWritable(1);
        // json parser 설정

        //private final JSONParser
        //private final JSONParser jsonParser = new JSONParser();

        public void map(Object key, Text value, Context context) throws IOException, InterruptedException {
            // 각 라인을 읽어들여서 토큰화
            StringTokenizer itr = new StringTokenizer(value.toString());
            ObjectMapper mapper = new ObjectMapper();
            try{
                // JSON 텍스트를 파싱해서 JSON 객체로 변환
                //JSONObject jsonObject = (JSONObject) jsonParser.parse(value.toString());

                // JSON 형식의 텍스트를 Java 객체로 변환 -> type과 body
                //
                Message message = mapper.readValue(value.toString(), Message.class);
            } catch (Exception e) {
                e.printStackTrace();
            }


        }
    }
}
