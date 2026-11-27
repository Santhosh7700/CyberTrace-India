package com.cybertrace.india.service;

import com.cybertrace.india.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class LocalStorageService implements StorageService {

    private final Path rootLocation;

    public LocalStorageService(@Value("${app.storage.local-dir:uploads/evidence}") String localDir) {
        this.rootLocation = Paths.get(localDir).toAbsolutePath().normalize();
        try {
            if (Files.exists(this.rootLocation, LinkOption.NOFOLLOW_LINKS)
                    && Files.isSymbolicLink(this.rootLocation)) {
                throw new SecurityException("Storage root cannot be a symbolic link");
            }
            Files.createDirectories(this.rootLocation);
        } catch (IOException ex) {
            throw new IllegalStateException("Could not initialize evidence storage directory", ex);
        }
    }

    @Override
    public String store(String reportReference, String originalFilename, InputStream content, String contentType, long size) {
        if (reportReference == null || reportReference.isBlank()) {
            throw new SecurityException("Invalid report reference");
        }
        String safeRef = sanitizeSegment(reportReference);
        String extension = extractSafeExtension(originalFilename);
        String generatedFilename = UUID.randomUUID() + extension;

        Path reportDir = this.rootLocation.resolve(safeRef).normalize();
        if (!reportDir.startsWith(this.rootLocation) || Files.isSymbolicLink(reportDir)) {
            throw new SecurityException("Invalid storage directory");
        }

        try {
            Files.createDirectories(reportDir);
            Path targetFile = reportDir.resolve(generatedFilename).normalize();
            if (!targetFile.startsWith(reportDir) || Files.isSymbolicLink(targetFile)) {
                throw new SecurityException("Invalid target file path");
            }
            Files.copy(content, targetFile, StandardCopyOption.REPLACE_EXISTING);
            return safeRef + "/" + generatedFilename;
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to store evidence file", ex);
        }
    }

    @Override
    public Resource loadAsResource(String storagePath) {
        Path file = resolveSafePath(storagePath);
        if (Files.isSymbolicLink(file)
                || Files.isSymbolicLink(file.getParent())
                || !Files.exists(file, LinkOption.NOFOLLOW_LINKS)
                || !Files.isRegularFile(file, LinkOption.NOFOLLOW_LINKS)
                || !Files.isReadable(file)) {
            throw new ResourceNotFoundException("Evidence file not found");
        }
        try {
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            }
            throw new ResourceNotFoundException("Evidence file not found");
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("Evidence file not found");
        }
    }

    @Override
    public void delete(String storagePath) {
        try {
            Path file = resolveSafePath(storagePath);
            if (!Files.isSymbolicLink(file) && !Files.isSymbolicLink(file.getParent())) {
                Files.deleteIfExists(file);
            }
        } catch (IOException | SecurityException | ResourceNotFoundException ignored) {
            // Best-effort cleanup
        }
    }

    private Path resolveSafePath(String storagePath) {
        if (storagePath == null || storagePath.isBlank() || storagePath.contains("..") || storagePath.contains("\\")) {
            throw new ResourceNotFoundException("Evidence file not found");
        }
        Path resolved = this.rootLocation.resolve(storagePath).normalize();
        if (!resolved.startsWith(this.rootLocation) || resolved.equals(this.rootLocation)) {
            throw new ResourceNotFoundException("Evidence file not found");
        }
        return resolved;
    }

    private String sanitizeSegment(String value) {
        return value.replaceAll("[^a-zA-Z0-9_-]", "_");
    }

    private String extractSafeExtension(String originalFilename) {
        if (originalFilename == null) {
            return "";
        }
        int lastDot = originalFilename.lastIndexOf('.');
        if (lastDot < 0 || lastDot == originalFilename.length() - 1) {
            return "";
        }
        String ext = originalFilename.substring(lastDot).toLowerCase();
        return ext.matches("\\.[a-z0-9]{1,10}") ? ext : "";
    }
}
