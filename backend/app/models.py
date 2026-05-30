import os
from sqlalchemy import create_engine, Column, Integer, Float, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker

current_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(current_dir, "..", "data", "movie_rec.db")

DATABASE_URL = f"sqlite:///{db_path}"

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} # Required for SQLite concurrency in FastAPI
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Rating(Base):
    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    movie_id = Column(Integer, index=True) # TMDb / Kaggle ID
    rating = Column(Float)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
