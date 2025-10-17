-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  telegram_id VARCHAR(50),
  telegram_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  coin_id VARCHAR(50) NOT NULL,
  coin_name VARCHAR(100) NOT NULL,
  coin_symbol VARCHAR(20) NOT NULL,
  alert_type VARCHAR(20) CHECK (alert_type IN ('price', 'percentage')) NOT NULL,
  target_price DECIMAL(20, 8),
  percentage_change DECIMAL(5, 2),
  comparison VARCHAR(20) CHECK (comparison IN ('above', 'below', 'increase', 'decrease')) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  triggered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Telegram users mapping table
CREATE TABLE IF NOT EXISTS telegram_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_id VARCHAR(50) UNIQUE NOT NULL,
  user_email VARCHAR(255) NOT NULL REFERENCES users(email),
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_coin_id ON alerts(coin_id);
CREATE INDEX IF NOT EXISTS idx_alerts_active ON alerts(is_active);
CREATE INDEX IF NOT EXISTS idx_alerts_triggered ON alerts(triggered);
CREATE INDEX IF NOT EXISTS idx_telegram_users_telegram_id ON telegram_users(telegram_id);

-- Update triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE telegram_users ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (id = auth.uid());

-- Users can only see their own alerts
CREATE POLICY "Users can view own alerts" ON alerts
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own alerts" ON alerts
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own alerts" ON alerts
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own alerts" ON alerts
    FOR DELETE USING (user_id = auth.uid());

-- Sample data (optional)
-- INSERT INTO users (email, password_hash) VALUES 
-- ('demo@example.com', '$2a$12$example.hash.here');

-- Comments for documentation
COMMENT ON TABLE users IS 'User accounts and authentication data';
COMMENT ON TABLE alerts IS 'Price and percentage alerts set by users';
COMMENT ON TABLE telegram_users IS 'Mapping between Telegram IDs and user emails';

COMMENT ON COLUMN alerts.alert_type IS 'Type of alert: price (absolute price) or percentage (price change %)';
COMMENT ON COLUMN alerts.comparison IS 'Comparison type: above/below for price alerts, increase/decrease for percentage alerts';
COMMENT ON COLUMN alerts.target_price IS 'Target price for price alerts (in USD)';
COMMENT ON COLUMN alerts.percentage_change IS 'Percentage change threshold for percentage alerts';
COMMENT ON COLUMN alerts.triggered IS 'Whether the alert has been triggered and notification sent';