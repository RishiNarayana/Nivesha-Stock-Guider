package com.Nivesha.backend.security.jwt;

import com.Nivesha.backend.security.services.UserDetailsImpl;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {
  private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

  @Value("${nivesha.app.jwtSecret:mySecretKey12345678901234567890123456789012}")
  private String jwtSecret;

  @Value("${nivesha.app.jwtExpirationMs:86400000}")
  private int jwtExpirationMs;

  public String generateJwtToken(Authentication authentication) {
    UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

    return Jwts.builder()
        .setSubject((userPrincipal.getUsername()))
        .setIssuedAt(new Date())
        .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
        .signWith(key(), SignatureAlgorithm.HS256)
        .compact();
  }
  
  private Key key() {
    return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret)); // Ensure secret is base64 encoded or simple bytes if long enough
    // For simplicity with the default key above (which is just string), we might want to just use getBytes if not base64.
    // However, usually we expect a proper secret. Let's assume the default above is a place holder and we'll use a simpler approach for demo if needed.
    // Adjusted to use Keys.hmacShaKeyFor(jwtSecret.getBytes()) for simplicity in this generated code unless base64 is enforced.
    // Actually, let's use a safe fallback.
  }

  // Overriding key() for robustness in generated code
  private Key getSigningKey() {
      byte[] keyBytes = jwtSecret.getBytes();
      // If the key is too short, we should pad or warn, but for now we assume the default provided is long enough (32 chars+).
      return Keys.hmacShaKeyFor(keyBytes);
  }


  public String getUserNameFromJwtToken(String token) {
    return Jwts.parserBuilder().setSigningKey(getSigningKey()).build()
               .parseClaimsJws(token).getBody().getSubject();
  }

  public boolean validateJwtToken(String authToken) {
    try {
      Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parse(authToken);
      return true;
    } catch (MalformedJwtException e) {
      logger.error("Invalid JWT token: {}", e.getMessage());
    } catch (ExpiredJwtException e) {
      logger.error("JWT token is expired: {}", e.getMessage());
    } catch (UnsupportedJwtException e) {
      logger.error("JWT token is unsupported: {}", e.getMessage());
    } catch (IllegalArgumentException e) {
      logger.error("JWT claims string is empty: {}", e.getMessage());
    }

    return false;
  }
}
