package com.preventech.backend.webconfig;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;


@Configuration
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

    private String secret;
    private long expiration;
    private String prefix;
    private String header;
    private long clockSkew; 
    
    public String getSecret() {
        return secret;
    }
    public void setSecret(String secret) {
        this.secret = secret;
    }
    public long getExpiration() {
        return expiration;
    }
    public void setExpiration(long expiration) {
        this.expiration = expiration;
    }
    public String getPrefix() {
        return prefix;
    }
    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }
    public String getHeader() {
        return header;
    }
    public void setHeader(String header) {
        this.header = header;
    }

    public long getClockSkew() {
        return clockSkew;
    }

    public void setClockSkew(long clockSkew) {
        this.clockSkew = clockSkew;
    }

}
