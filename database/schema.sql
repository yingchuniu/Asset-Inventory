 
CREATE TABLE risk_assessments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  asset_id INT NOT NULL,
  threat VARCHAR(200),
  vulnerability VARCHAR(200),
  risk_value INT,
  FOREIGN KEY (asset_id) REFERENCES assets(id)
);