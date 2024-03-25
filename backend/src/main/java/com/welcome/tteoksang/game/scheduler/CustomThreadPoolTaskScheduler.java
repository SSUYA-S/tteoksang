package com.welcome.tteoksang.game.scheduler;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

import java.util.Date;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.ThreadPoolExecutor;

@Configuration
@Primary
public class CustomThreadPoolTaskScheduler extends ThreadPoolTaskScheduler {
    private static final long serialVersionUID = 1L;

    CustomThreadPoolTaskScheduler(){
        setPoolSize(2);
        setRejectedExecutionHandler(new ThreadPoolExecutor.AbortPolicy());
    }

    @Override
    public ScheduledFuture<?> scheduleAtFixedRate(Runnable task, long period) {
        if (period <= 0) {
            return null;
        }
        ScheduledFuture<?> future = super.scheduleAtFixedRate(task, period);
        return future;
    }

    @Override
    public ScheduledFuture<?> scheduleAtFixedRate(Runnable task, Date startTime, long period) {
        if (period <= 0) {
            return null;
        }
        ScheduledFuture<?> future = super.scheduleAtFixedRate(task, startTime, period); return future;
    }
}