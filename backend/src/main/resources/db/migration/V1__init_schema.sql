-- CyberTrace-India Initial Database Schema (Flyway V1)
-- Normalized relational schema for Citizen, Investigator, and Admin workflows.

-- 1. Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN ('CITIZEN', 'INVESTIGATOR', 'ADMIN')),
    account_status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (account_status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- 2. Citizen Profiles Table
CREATE TABLE citizen_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Investigator Profiles Table
CREATE TABLE investigator_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    cyber_id VARCHAR(64) NOT NULL UNIQUE,
    badge_number VARCHAR(64) NOT NULL UNIQUE,
    display_name VARCHAR(150) NOT NULL,
    rank_title VARCHAR(150),
    department VARCHAR(150) NOT NULL,
    availability_status VARCHAR(32) NOT NULL DEFAULT 'AVAILABLE' CHECK (availability_status IN ('AVAILABLE', 'ACTIVE_DUTY', 'HIGH_WORKLOAD', 'ON_LEAVE')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_investigator_cyber_id ON investigator_profiles(cyber_id);

-- 4. Scam Reports Table
CREATE TABLE scam_reports (
    id BIGSERIAL PRIMARY KEY,
    case_reference VARCHAR(32) NOT NULL UNIQUE,
    citizen_id BIGINT NOT NULL REFERENCES citizen_profiles(id) ON DELETE RESTRICT,
    scam_category VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    financial_loss NUMERIC(15, 2) DEFAULT 0.00,
    transaction_id VARCHAR(128),
    platform VARCHAR(150) NOT NULL,
    incident_date DATE NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    priority VARCHAR(24) NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    status VARCHAR(32) NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'UNDER_REVIEW', 'UNDER_INVESTIGATION', 'EVIDENCE_VERIFICATION', 'RESOLVED', 'CLOSED')),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_scam_reports_ref ON scam_reports(case_reference);
CREATE INDEX idx_scam_reports_citizen ON scam_reports(citizen_id);
CREATE INDEX idx_scam_reports_status ON scam_reports(status);
CREATE INDEX idx_scam_reports_category ON scam_reports(scam_category);

-- 5. Report Identifiers Table (Supports multiple typed identifiers per report)
CREATE TABLE report_identifiers (
    id BIGSERIAL PRIMARY KEY,
    report_id BIGINT NOT NULL REFERENCES scam_reports(id) ON DELETE CASCADE,
    identifier_type VARCHAR(24) NOT NULL CHECK (identifier_type IN ('PHONE', 'UPI', 'EMAIL', 'URL')),
    original_value VARCHAR(512) NOT NULL,
    normalized_value VARCHAR(512) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_report_identifiers_report ON report_identifiers(report_id);
CREATE INDEX idx_report_identifiers_type_norm ON report_identifiers(identifier_type, normalized_value);

-- 6. Evidence Files Table (Metadata only; binaries stored via StorageService abstraction)
CREATE TABLE evidence_files (
    id BIGSERIAL PRIMARY KEY,
    report_id BIGINT NOT NULL REFERENCES scam_reports(id) ON DELETE CASCADE,
    original_filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(128) NOT NULL,
    file_size BIGINT NOT NULL,
    storage_path VARCHAR(1024) NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_evidence_files_report ON evidence_files(report_id);

-- 7. Case Assignments Table
CREATE TABLE case_assignments (
    id BIGSERIAL PRIMARY KEY,
    report_id BIGINT NOT NULL UNIQUE REFERENCES scam_reports(id) ON DELETE CASCADE,
    investigator_id BIGINT NOT NULL REFERENCES investigator_profiles(id) ON DELETE RESTRICT,
    assigned_by_admin_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    assignment_status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (assignment_status IN ('ACTIVE', 'REASSIGNED', 'COMPLETED'))
);

CREATE INDEX idx_case_assignments_investigator ON case_assignments(investigator_id);

-- 8. Case Activity Logs Table
CREATE TABLE case_activity_logs (
    id BIGSERIAL PRIMARY KEY,
    report_id BIGINT NOT NULL REFERENCES scam_reports(id) ON DELETE CASCADE,
    actor_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    actor_role VARCHAR(32) NOT NULL,
    activity_type VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_case_activity_logs_report ON case_activity_logs(report_id);

-- 9. Assignment History Table
CREATE TABLE assignment_history (
    id BIGSERIAL PRIMARY KEY,
    report_id BIGINT NOT NULL REFERENCES scam_reports(id) ON DELETE CASCADE,
    previous_investigator_id BIGINT REFERENCES investigator_profiles(id) ON DELETE SET NULL,
    new_investigator_id BIGINT NOT NULL REFERENCES investigator_profiles(id) ON DELETE RESTRICT,
    admin_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    action_type VARCHAR(32) NOT NULL CHECK (action_type IN ('INITIAL_ASSIGNMENT', 'REASSIGNMENT')),
    notes TEXT,
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assignment_history_report ON assignment_history(report_id);
CREATE INDEX idx_assignment_history_new_inv ON assignment_history(new_investigator_id);
