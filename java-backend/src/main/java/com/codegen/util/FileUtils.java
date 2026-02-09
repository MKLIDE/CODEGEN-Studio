package com.codegen.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Component
@Slf4j
public class FileUtils {
    
    public boolean createDirectory(String path) {
        try {
            Files.createDirectories(Paths.get(path));
            return true;
        } catch (IOException e) {
            log.error("Failed to create directory: {}", path, e);
            return false;
        }
    }
    
    public boolean deleteDirectory(String path) {
        try {
            Path directory = Paths.get(path);
            Files.walk(directory)
                .sorted((a, b) -> -a.compareTo(b))
                .forEach(p -> {
                    try {
                        Files.delete(p);
                    } catch (IOException e) {
                        log.warn("Failed to delete file: {}", p, e);
                    }
                });
            return true;
        } catch (IOException e) {
            log.error("Failed to delete directory: {}", path, e);
            return false;
        }
    }
    
    public List<String> listFiles(String directory, boolean recursive) {
        List<String> files = new ArrayList<>();
        
        try {
            Path start = Paths.get(directory);
            
            if (recursive) {
                Files.walkFileTree(start, new SimpleFileVisitor<Path>() {
                    @Override
                    public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) {
                        files.add(file.toString());
                        return FileVisitResult.CONTINUE;
                    }
                    
                    @Override
                    public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) {
                        if (!dir.equals(start)) {
                            files.add(dir.toString() + File.separator);
                        }
                        return FileVisitResult.CONTINUE;
                    }
                });
            } else {
                try (DirectoryStream<Path> stream = Files.newDirectoryStream(start)) {
                    for (Path path : stream) {
                        files.add(path.toString());
                    }
                }
            }
        } catch (IOException e) {
            log.error("Failed to list files in directory: {}", directory, e);
        }
        
        return files;
    }
    
    public boolean copyDirectory(String source, String destination) {
        try {
            Path sourcePath = Paths.get(source);
            Path destPath = Paths.get(destination);
            
            Files.walk(sourcePath)
                .forEach(sourceFile -> {
                    try {
                        Path destFile = destPath.resolve(sourcePath.relativize(sourceFile));
                        Files.copy(sourceFile, destFile, StandardCopyOption.REPLACE_EXISTING);
                    } catch (IOException e) {
                        log.error("Failed to copy file: {}", sourceFile, e);
                    }
                });
            
            return true;
        } catch (IOException e) {
            log.error("Failed to copy directory from {} to {}", source, destination, e);
            return false;
        }
    }
    
    public boolean createZipArchive(String sourceDir, String zipFilePath) {
        try (ZipOutputStream zos = new ZipOutputStream(Files.newOutputStream(Paths.get(zipFilePath)))) {
            Path sourcePath = Paths.get(sourceDir);
            
            Files.walk(sourcePath)
                .filter(path -> !Files.isDirectory(path))
                .forEach(path -> {
                    try {
                        String zipEntryName = sourcePath.relativize(path).toString().replace('\\', '/');
                        zos.putNextEntry(new ZipEntry(zipEntryName));
                        Files.copy(path, zos);
                        zos.closeEntry();
                    } catch (IOException e) {
                        log.error("Failed to add file to zip: {}", path, e);
                    }
                });
            
            return true;
        } catch (IOException e) {
            log.error("Failed to create zip archive: {}", zipFilePath, e);
            return false;
        }
    }
    
    public boolean isValidFileName(String fileName) {
        if (fileName == null || fileName.trim().isEmpty()) {
            return false;
        }
        
        // Check for invalid characters
        String invalidChars = "[\\\\/:*?\"<>|]";
        if (fileName.matches(".*" + invalidChars + ".*")) {
            return false;
        }
        
        // Check for reserved names (Windows)
        String[] reservedNames = {
            "CON", "PRN", "AUX", "NUL",
            "COM1", "COM2", "COM3", "COM4",
            "LPT1", "LPT2", "LPT3", "LPT4"
        };
        
        String upperName = fileName.toUpperCase();
        for (String reserved : reservedNames) {
            if (upperName.equals(reserved)) {
                return false;
            }
        }
        
        return true;
    }
    
    public String getFileExtension(String fileName) {
        if (fileName == null) {
            return "";
        }
        
        int lastDot = fileName.lastIndexOf('.');
        if (lastDot > 0 && lastDot < fileName.length() - 1) {
            return fileName.substring(lastDot + 1).toLowerCase();
        }
        
        return "";
    }
    
    public long getDirectorySize(String path) {
        try {
            return Files.walk(Paths.get(path))
                .filter(p -> p.toFile().isFile())
                .mapToLong(p -> p.toFile().length())
                .sum();
        } catch (IOException e) {
            log.error("Failed to calculate directory size: {}", path, e);
            return 0;
        }
    }
}
