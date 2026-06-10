from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import json
import os
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_FILE = "favorites.json"

if not os.path.exists(DB_FILE):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump([], f)

class FavoriteSchema(BaseModel):
    name: str
    schema_data: Dict[str, Any]

def read_db():
    with open(DB_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def write_db(data):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

@app.get("/favorites")
async def get_favorites():
    return read_db()

@app.post("/favorites")
async def add_favorite(fav: FavoriteSchema):
    db = read_db()
    new_item = {
        "id": str(uuid.uuid4()),
        "name": fav.name,
        "schema": fav.schema_data
    }
    db.append(new_item)
    write_db(db)
    return new_item

@app.delete("/favorites/{fav_id}")
async def delete_favorite(fav_id: str):
    db = read_db()
    db = [item for item in db if item["id"] != fav_id]
    write_db(db)
    return {"status": "ok"}