package com.codegen.integration;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class FileSystemIntegration {
    
    public List<String> scanDirectory(String path) {
        List<String> files = new ArrayList<>();
        
        try {
            Path start = Paths.get(path);
            
            Files.walkFileTree(start, new SimpleFileVisitor<Path>() {
                @Override
                public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) {
                    files.add(file.toString());
                    return FileVisitResult.CONTINUE;
                }
                
                @Override
                public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) {
                    if (!dir.equals(start)) {
                        files.add(dir.toString() + "/");
                    }
                    return FileVisitResult.CONTINUE;
                }
                
                @Override
                public FileVisitResult visitFileFailed(Path file, IOException exc) {
                    log.warn("Failed to access file: {}", file, exc);
                    return FileVisitResult.CONTINUE;
                }
            });
        } catch (IOException e) {
            log.error("Failed to scan directory: {}", path, e);
        }
        
        return files;
    }
    
    public boolean watchDirectory(String path, DirectoryChangeListener listener) {
        try {
            WatchService watchService = FileSystems.getDefault().newWatchService();
            Path dir = Paths.get(path);
            
            dir.register(watchService, 
                StandardWatchEventKinds.ENTRY_CREATE,
                StandardWatchEventKinds.ENTRY_DELETE,
                StandardWatchEventKinds.ENTRY_MODIFY);
            
            // Start watching in a separate thread
            new Thread(() -> {
                try {
                    while (true) {
                        WatchKey key = watchService.take();
                        
                        for (WatchEvent<?> event : key.pollEvents()) {
                            WatchEvent.Kind<?> kind = event.kind();
                            Path fileName = (Path) event.context();
                            Path fullPath = dir.resolve(fileName);
                            
                            if (kind == StandardWatchEventKinds.ENTRY_CREATE) {
                                listener.onFileCreated(fullPath.toString());
                            } else if (kind == StandardWatchEventKinds.ENTRY_DELETE) {
                                listener.onFileDeleted(fullPath.toString());
                            } else if (kind == StandardWatchEventKinds.ENTRY_MODIFY) {
                                listener.onFileModified(fullPath.toString());
                            }
                        }
                        
                        boolean valid = key.reset();
                        if (!valid) {
                            break;
                        }
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    log.info("Directory watching interrupted");
                }
            }).start();
            
            return true;
        } catch (IOException e) {
            log.error("Failed to watch directory: {}", path, e);
            return false;
        }
    }
    
    public interface DirectoryChangeListener {
        void onFileCreated(String filePath);
        void onFileDeleted(String filePath);
        void onFileModified(String filePath);
    }
    
    public String readFile(String path) {
        try {
            return new String(Files.readAllBytes(Paths.get(path)));
        } catch (IOException e) {
            log.error("Failed to read file: {}", path, e);
            return "";
        }
    }
    
    public boolean writeFile(String path, String content) {
        try {
            Path filePath = Paths.get(path);
            Path parent = filePath.getParent();
            
            if (parent != null) {
                Files.createDirectories(parent);
            }
            
            Files.write(filePath, content.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            return true;
        } catch (IOException e) {
            log.error("Failed to write file: {}", path, e);
            return false;
        }
    }
    
    public boolean deleteFile(String path) {
        try {
            Files.deleteIfExists(Paths.get(path));
            return true;
        } catch (IOException e) {
            log.error("Failed to delete file: {}", path, e);
            return false;
        }
    }
    
    public boolean fileExists(String path) {
        return Files.exists(Paths.get(path));
    }
    
    public boolean isDirectory(String path) {
        return Files.isDirectory(Paths.get(path));
    }
    
    public long getFileSize(String path) {
        try {
            return Files.size(Paths.get(path));
        } catch (IOException e) {
            log.error("Failed to get file size: {}", path, e);
            return 0;
        }
    }
    
    public String getFileExtension(String path) {
        if (path == null) {
            return "";
        }
        
        int lastDot = path.lastIndexOf('.');
        if (lastDot > 0 && lastDot < path.length() - 1) {
            return path.substring(lastDot + 1).toLowerCase();
        }
        
        return "";
    }
}
