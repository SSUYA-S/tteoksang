package com.welcome;

import com.welcome.Main.LogMapper;
import com.welcome.Main.LogReducer;
import java.io.IOException;
import java.text.ParseException;
import java.util.StringTokenizer;


import com.fasterxml.jackson.core.JsonParser;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.util.GenericOptionsParser;
import org.apache.hadoop.util.ProgramDriver;
import org.codehaus.jackson.map.ObjectMapper;


public class Driver {
    public static void main(String[] args) {
        // Main 함수 시작
        Configuration conf = new Configuration();
        ProgramDriver pgd = new ProgramDriver();
        int exitCode = -1;

        try(FileSystem fs = FileSystem.get(conf)) {
            pgd.addClass("statistics", Main.class, "map/reduce program that performs statistics calculation");
            String[] otherArgs = new GenericOptionsParser(conf, args).getRemainingArgs();
            if (otherArgs.length != 2) {
                System.err.println("Usage: <in> <out>");
                System.exit(2);
            }

            Job job = new Job(conf, "log filtering");
            job.setJarByClass(Main.class);

            // let hadoop know map and reduce classes
            job.setMapperClass(LogMapper.class);
            job.setReducerClass(LogReducer.class);

            job.setOutputKeyClass(Text.class);
            job.setOutputValueClass(Text.class);

            // set number of reduces
            job.setNumReduceTasks(16);

            Path inputPath = new Path(args[0]);
            Path outputPath = new Path(args[1]);

            fs.delete(outputPath, true);

            // set input and output directories
            FileInputFormat.addInputPath(job, inputPath);
            FileOutputFormat.setOutputPath(job, outputPath);

            pgd.driver(args);
            exitCode = 0;
        } catch (Exception e) {
            e.printStackTrace();
        } catch (Throwable e) {
            e.printStackTrace();
        }

        System.exit(exitCode);
    }

}
