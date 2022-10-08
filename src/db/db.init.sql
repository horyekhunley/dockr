CREATE DATABASE IF NOT EXISTS patientsdb;
USE patientsdb;
DROP TABLE IF EXISTS patients;

CREATE TABLE patients(
    id              BIGINT NOT NULL AUTO_INCREMENT,
    first_name      VARCHAR(255) DEFAULT NULL,
    last_name       VARCHAR(255) DEFAULT NULL,
    email           VARCHAR(255) DEFAULT NULL,
    phone           VARCHAR(30) DEFAULT NULL,
	status          VARCHAR(30) DEFAULT NULL,
    home_address    VARCHAR(255) DEFAULT NULL,
    diagnosis       VARCHAR(255) DEFAULT NULL,
    image_url       VARCHAR(255) DEFAULT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT UQ_Patients_Email UNIQUE (email)
) AUTO_INCREMENT = 1;