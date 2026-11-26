package com.cybertrace.india.service;

import java.io.InputStream;

/**
 * Storage abstraction for evidence files.
 * Implementations can target local filesystem, S3, or object storage without storing binaries in PostgreSQL.
 */
public interface StorageService {

    String store(String reportReference, String originalFilename, InputStream content, String contentType, long size);

    void delete(String storagePath);
}
