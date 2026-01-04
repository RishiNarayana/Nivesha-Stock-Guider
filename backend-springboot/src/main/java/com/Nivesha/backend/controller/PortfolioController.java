package com.Nivesha.backend.controller;

import com.Nivesha.backend.model.Portfolio;
import com.Nivesha.backend.model.User;
import com.Nivesha.backend.repository.PortfolioRepository;
import com.Nivesha.backend.repository.UserRepository;
import com.Nivesha.backend.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    @Autowired
    PortfolioRepository portfolioRepository;
    
    @Autowired
    UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getUserPortfolio() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userId = userDetails.getId();
        
        Optional<Portfolio> portfolio = portfolioRepository.findByUserId(userId);
        if (portfolio.isPresent()) {
            return ResponseEntity.ok(portfolio.get());
        } else {
            // Return empty portfolio structure if not found
            return ResponseEntity.ok(new Portfolio(null, userId, new ArrayList<>()));
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addHolding(@RequestBody Portfolio.Holding holding) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userId = userDetails.getId();
        
        Portfolio portfolio = portfolioRepository.findByUserId(userId)
                .orElse(new Portfolio(null, userId, new ArrayList<>()));
        
        List<Portfolio.Holding> holdings = portfolio.getHoldings();
        if (holdings == null) holdings = new ArrayList<>();
        
        boolean exists = false;
        for (Portfolio.Holding h : holdings) {
            if (h.getSymbol().equalsIgnoreCase(holding.getSymbol())) {
                // Average Price Calculation: (oldQty * oldPrice + newQty * newPrice) / totalQty
                double totalValue = (h.getQuantity() * h.getAveragePrice()) + (holding.getQuantity() * holding.getAveragePrice());
                int totalQty = h.getQuantity() + holding.getQuantity();
                
                if (totalQty <= 0) {
                    holdings.remove(h);
                } else {
                    h.setAveragePrice(totalValue / totalQty);
                    h.setQuantity(totalQty);
                }
                exists = true;
                break;
            }
        }
        if (!exists && holding.getQuantity() > 0) {
            holdings.add(holding);
        }
        
        portfolio.setHoldings(holdings);
        portfolioRepository.save(portfolio);
        
        return ResponseEntity.ok(portfolio);
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getPortfolioSummary() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<Portfolio> portfolio = portfolioRepository.findByUserId(userDetails.getId());
        
        if (portfolio.isPresent()) {
            return ResponseEntity.ok(portfolio.get().getHoldings());
        }
        return ResponseEntity.ok(new ArrayList<>());
    }
}
