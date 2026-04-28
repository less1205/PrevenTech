package com.preventech.backend.webconfig;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class PasswordGenerator {

    @Bean
    public CommandLineRunner generatePasswords() {
        return args -> {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

            String[] contraseñas = {
                "Jperez#2025",
                "Mgonzalez*89",
                "Ptorres!77",
                "Afernandez@66",
                "Lramirez$55",
                "Csoto%44",
                "Dmorales&33",
                "Projas?22",
                "Jherrera+11",
                "Vcastillo=99",
                "Svarela^88",
                "Inavarro*77",
                "Taguilar#66",
                "Fparedes!55",
                "Amolina@44",
                "Criquelme$33",
                "Mfuentes%22",
                "Nsepulveda&11",
                "atorres12345",
                "cmunozmiroo123",
                "srivas12345",
                "psalazar123",
                "raguirre123",
                "lmedina123",
                "fpizarro123",
                "caraya123",
                "jespinoza123",
                "vcastillo123",
                "dolivares123",
                "crojas123",
                "mfernandez123"
            };

            for (String plain : contraseñas) {
                String hash = encoder.encode(plain);
                System.out.println(plain + " -> " + hash);
            }
        };
    }
}
