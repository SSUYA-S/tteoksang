package com.welcome.tteoksang.config;

import io.lettuce.core.ReadFrom;
import java.time.Duration;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.data.redis.RedisProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisPassword;
import org.springframework.data.redis.connection.RedisSentinelConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@RequiredArgsConstructor
@Configuration
@EnableRedisRepositories
@Slf4j
public class RedisConfiguration {
  @Value("${spring.data.redis.timeout}")
  private Duration redisCommandTimeout;

  private final RedisProperties redisProperties;

  @Bean
  public LettuceConnectionFactory redisConnectionFactory() {
    String master = redisProperties.getSentinel().getMaster();
    Set<String> nodes = new HashSet<>(redisProperties.getSentinel().getNodes());
    RedisSentinelConfiguration sentinelConfiguration = new RedisSentinelConfiguration(master, nodes);
    sentinelConfiguration.setPassword(RedisPassword.of(redisProperties.getPassword()));

    LettuceClientConfiguration clientConfiguration = LettuceClientConfiguration.builder()
        .commandTimeout(redisCommandTimeout).readFrom(
            ReadFrom.REPLICA_PREFERRED).build();

    return new LettuceConnectionFactory(sentinelConfiguration, clientConfiguration);
  }

  @Bean
  public RedisTemplate<String, Object> objectRedisTemplate() {
    RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
    redisTemplate.setKeySerializer(new StringRedisSerializer());
    redisTemplate.setValueSerializer(new GenericJackson2JsonRedisSerializer());
    redisTemplate.setConnectionFactory(redisConnectionFactory());

    return redisTemplate;
  }

  @Bean
  public RedisTemplate<String, List<String>> listRedisTemplate(
      RedisConnectionFactory redisConnectionFactory) {
    RedisTemplate<String, List<String>> redisTemplate = new RedisTemplate<>();
    redisTemplate.setConnectionFactory(redisConnectionFactory);

    // key의 직렬화 설정
    redisTemplate.setKeySerializer(new StringRedisSerializer());

    // value의 직렬화 설정
    redisTemplate.setValueSerializer(new StringRedisSerializer());

    // hash key와 hash value의 직렬화 설정
    redisTemplate.setHashKeySerializer(new StringRedisSerializer());
    redisTemplate.setHashValueSerializer(new StringRedisSerializer());

    redisTemplate.afterPropertiesSet();
    return redisTemplate;
  }

  @Bean
  public ListOperations<String, String> listOperations(
      RedisTemplate<String, String> redisTemplate) {
    return redisTemplate.opsForList();
  }
}
