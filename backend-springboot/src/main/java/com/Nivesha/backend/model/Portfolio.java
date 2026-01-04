package com.Nivesha.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "portfolios")
public class Portfolio {
    @Id
    private String id;
    
    private String userId;
    
    private List<Holding> holdings;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Holding {
        private String symbol;
        private int quantity;
        private double averagePrice;
    }
}
