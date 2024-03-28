package com.welcome.tteoksang.redis;

import com.welcome.tteoksang.game.dto.UserProductInfo;

import java.io.*;
import java.util.Map;

public class RedisSerializationUtil {

    public static byte[] serializeMap(Map<Integer, UserProductInfo> map) {
        try (ByteArrayOutputStream byteStream = new ByteArrayOutputStream();
             ObjectOutputStream objectOutputStream = new ObjectOutputStream(byteStream)) {
            objectOutputStream.writeObject(map);
            return byteStream.toByteArray();
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public static Map<Integer, UserProductInfo> deserializeMap(byte[] bytes) {
        try (ByteArrayInputStream byteStream = new ByteArrayInputStream(bytes);
             ObjectInputStream objectInputStream = new ObjectInputStream(byteStream)) {
            return (Map<Integer, UserProductInfo>) objectInputStream.readObject();
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
            return null;
        }
    }
}
