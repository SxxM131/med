-- ============================================
-- username 컬럼 추가 마이그레이션 스크립트
-- ============================================

-- username 컬럼이 없으면 추가
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'username'
    ) THEN
        -- 기존 데이터가 있을 수 있으므로 먼저 NULL 허용으로 추가
        ALTER TABLE users ADD COLUMN username VARCHAR(255);
        
        -- 기존 데이터가 있다면 email을 기반으로 username 생성
        -- (email의 @ 앞부분을 username으로 사용)
        UPDATE users 
        SET username = SPLIT_PART(email, '@', 1) 
        WHERE username IS NULL;
        
        -- NOT NULL 제약조건 추가
        ALTER TABLE users ALTER COLUMN username SET NOT NULL;
        
        -- UNIQUE 제약조건 추가
        ALTER TABLE users ADD CONSTRAINT uk_users_username UNIQUE (username);
        
        -- 인덱스 추가 (이미 존재할 수 있으므로 IF NOT EXISTS 사용)
        CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
        
        RAISE NOTICE 'username 컬럼이 성공적으로 추가되었습니다.';
    ELSE
        RAISE NOTICE 'username 컬럼이 이미 존재합니다.';
    END IF;
END $$;

