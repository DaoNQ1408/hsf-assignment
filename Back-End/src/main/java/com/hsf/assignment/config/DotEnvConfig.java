package com.hsf.assignment.config;

import io.github.cdimascio.dotenv.Dotenv;

public class DotEnvConfig {
    public DotEnvConfig() {
    }

    public static void loadEnv() {
        Dotenv dotenv = Dotenv
                .configure()
                .filename(".env")
                .load(); // sẽ load từ classpath
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
    }
}
