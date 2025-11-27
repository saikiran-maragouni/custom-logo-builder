INSERT INTO users (username, email, password, created_at) VALUES 
('demo', 'demo@example.com', 'demo123', NOW());

INSERT INTO logos (name, canvas_data, created_at, user_id, is_public) VALUES 
('Logistic Business Logo', '{"version":"5.3.0","objects":[{"type":"rect","version":"5.3.0","left":200,"top":150,"width":200,"height":100,"fill":"#842A3B","stroke":"#A3485A","strokeWidth":3},{"type":"triangle","version":"5.3.0","left":250,"top":120,"width":60,"height":60,"fill":"#A3485A"},{"type":"text","version":"5.3.0","left":220,"top":280,"text":"LOGISTICS","fontFamily":"Arial","fontSize":24,"fill":"#842A3B","fontWeight":"bold"},{"type":"text","version":"5.3.0","left":240,"top":310,"text":"EXPRESS","fontFamily":"Arial","fontSize":16,"fill":"#A3485A"}]}', NOW(), 1, false);
INSERT INTO logos (name, canvas_data, created_at, user_id, is_public) VALUES 
('Sample Logo 2', '{"version":"5.3.0","objects":[{"type":"circle","version":"5.3.0","left":150,"top":150,"radius":50,"fill":"#059669"}]}', NOW(), 1, true);