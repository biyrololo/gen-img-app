import os

DATABASE_URL = os.getenv("DATABASE_URL")
# DATABASE_URL = "postgresql://postgres:rootroot@localhost:5433/gen-images-site"

from sqlalchemy import create_engine, text, Column, Integer, String
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.exc import IntegrityError


engine = create_engine(DATABASE_URL)

Base = declarative_base()

class Image(Base):
    __tablename__ = "images"
    id = Column(Integer, primary_key=True)
    image = Column(String, nullable=False)
    prompt = Column(String, nullable=False)
    negative_prompt = Column(String, nullable=False)
    model = Column(String, nullable=False)

Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)

def add_image(image: str, prompt: str, negative_prompt: str, model: str, db):
    try:
        image = Image(image=image, prompt=prompt, negative_prompt=negative_prompt, model=model)
        db.add(image)
        db.commit()
    finally:
        db.close()

def get_all_images(db):
    return db.query(Image).all()


def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()