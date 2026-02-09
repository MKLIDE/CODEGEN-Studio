package com.codegen.util;

import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
public class ValidationUtils {
    
    private static final Pattern EMAIL_PATTERN = 
        Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    
    private static final Pattern URL_PATTERN =
        Pattern.compile("^(https?|ftp)://[^\\s/$.?#].[^\\s]*$");
    
    private static final Pattern SAFE_FILENAME_PATTERN =
        Pattern.compile("^[a-zA-Z0-9][a-zA-Z0-9._ -]*[a-zA-Z0-9]$");
    
    public boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        return EMAIL_PATTERN.matcher(email).matches();
    }
    
    public boolean isValidUrl(String url) {
        if (url == null || url.trim().isEmpty()) {
            return false;
        }
        return URL_PATTERN.matcher(url).matches();
    }
    
    public boolean isValidProjectName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return false;
        }
        
        // Length check
        if (name.length() > 50) {
            return false;
        }
        
        // Safe filename check
        if (!SAFE_FILENAME_PATTERN.matcher(name).matches()) {
            return false;
        }
        
        // Reserved names check
        String[] reservedNames = {
            "con", "prn", "aux", "nul",
            "com1", "com2", "com3", "com4",
            "lpt1", "lpt2", "lpt3", "lpt4"
        };
        
        String lowerName = name.toLowerCase();
        for (String reserved : reservedNames) {
            if (lowerName.equals(reserved)) {
                return false;
            }
        }
        
        return true;
    }
    
    public boolean isValidPath(String path) {
        if (path == null || path.trim().isEmpty()) {
            return false;
        }
        
        // Check for directory traversal attempts
        if (path.contains("..") || path.contains("//") || path.contains("\\\\")) {
            return false;
        }
        
        // Check for invalid characters
        String invalidChars = "[\\\\:*?\"<>|]";
        if (Pattern.compile(invalidChars).matcher(path).find()) {
            return false;
        }
        
        return true;
    }
    
    public String sanitizeInput(String input) {
        if (input == null) {
            return "";
        }
        
        // Remove potentially dangerous characters
        return input.replaceAll("[<>\"']", "");
    }
    
    public boolean isStrongPassword(String password) {
        if (password == null || password.length() < 8) {
            return false;
        }
        
        // Check for at least one uppercase, one lowercase, one digit, one special char
        boolean hasUpper = false;
        boolean hasLower = false;
        boolean hasDigit = false;
        boolean hasSpecial = false;
        
        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) hasUpper = true;
            if (Character.isLowerCase(c)) hasLower = true;
            if (Character.isDigit(c)) hasDigit = true;
            if (!Character.isLetterOrDigit(c)) hasSpecial = true;
        }
        
        return hasUpper && hasLower && hasDigit && hasSpecial;
    }
}
