from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

app = FastAPI(title="Task Manager API")

# In-memory list, same as `menu = []` in the original script
tasks: list[str] = []


class TaskIn(BaseModel):
    task: str = Field(..., min_length=1, max_length=200)


@app.get("/api/tasks")
def view_tasks():
    """Option 2: View tasks"""
    return {"tasks": tasks}


@app.post("/api/tasks", status_code=201)
def add_task(item: TaskIn):
    """Option 1: Add task"""
    text = item.task.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Task cannot be empty")
    tasks.append(text)
    return {"message": "task added", "tasks": tasks}


@app.delete("/api/tasks/{index}")
def delete_task(index: int):
    """Option 3: Delete task by index"""
    if index < 0 or index >= len(tasks):
        raise HTTPException(status_code=404, detail="Task index out of range")
    removed = tasks.pop(index)
    return {"message": f"deleted '{removed}'", "tasks": tasks}


# Serve the frontend (html, css, js)
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
def index():
    return FileResponse("static/index.html")
