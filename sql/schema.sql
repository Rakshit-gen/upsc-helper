CREATE TABLE IF NOT EXISTS study_sessions (
    id SERIAL PRIMARY KEY,
    hours DECIMAL(5,2) NOT NULL,
    topic VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS test_results (
    id SERIAL PRIMARY KEY,
    test_type VARCHAR(50) NOT NULL,
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS flashcards (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    topic VARCHAR(255),
    times_reviewed INTEGER DEFAULT 0,
    next_review TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pyq_questions (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    year INTEGER NOT NULL,
    topic VARCHAR(255) NOT NULL,
    answer TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_flashcards_next_review ON flashcards(next_review);
CREATE INDEX idx_pyq_topic ON pyq_questions(topic);
CREATE INDEX idx_pyq_year ON pyq_questions(year);
CREATE INDEX idx_activities_created ON activities(created_at DESC);
CREATE INDEX idx_study_sessions_created ON study_sessions(created_at DESC);
CREATE INDEX idx_test_results_created ON test_results(created_at DESC);

INSERT INTO pyq_questions (question, year, topic) VALUES
('Discuss the significance of the 73rd and 74th Constitutional Amendments in the context of decentralization in India.', 2023, 'polity'),
('Examine the role of the National Green Tribunal in environmental protection.', 2023, 'environment'),
('Analyze the impact of GST on the Indian economy.', 2022, 'economy'),
('Discuss the challenges in implementing the Right to Education Act.', 2022, 'polity'),
('Evaluate the effectiveness of MGNREGA in rural development.', 2021, 'economy'),
('Examine the recent changes in India monsoon pattern and their implications.', 2021, 'geography'),
('Discuss the constitutional provisions for the protection of minorities.', 2020, 'polity'),
('Analyze the significance of the Quit India Movement.', 2020, 'history'),
('Examine the role of biotechnology in agriculture.', 2023, 'science'),
('Discuss the impact of climate change on biodiversity.', 2022, 'environment');

INSERT INTO flashcards (question, answer, topic, next_review) VALUES
('What is the composition of Lok Sabha?', 'Maximum 552 members - 530 from states, 20 from UTs, 2 Anglo-Indians (now abolished)', 'polity', NOW()),
('What is GDP?', 'Gross Domestic Product - total monetary value of all finished goods and services produced within a country', 'economy', NOW()),
('What is the Tropic of Cancer?', 'Latitude 23.5°N, passes through 8 Indian states', 'geography', NOW()),
('When was the First War of Independence?', '1857, also called Sepoy Mutiny', 'history', NOW()),
('What is CRISPR?', 'Gene editing technology using Cas9 enzyme', 'science', NOW());
