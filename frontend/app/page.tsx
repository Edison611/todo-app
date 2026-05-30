
"use client";
import React, { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";

export type TodoItem = {
  id: number;
  title: string;
  priority: number;
};

function getMissingPriorities(todos: TodoItem[]): number[] {
  if (todos.length === 0) return [];
  const priorities = todos.map((t) => t.priority);
  const min = 1;
  const max = Math.max(...priorities);
  const missing: number[] = [];
  for (let i = min; i <= max; i++) {
    if (!priorities.includes(i)) missing.push(i);
  }
  return missing;
}

function Home() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState("");

  // Fetch tasks from API
  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTodos(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const prio = parseInt(priority, 10);
    if (!title.trim() || !priority || isNaN(prio) || prio <= 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, priority: prio }),
      });
      if (!res.ok) throw new Error("Failed to add task");
      setTitle("");
      setPriority("");
      await fetchTodos();
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) throw new Error("Failed to delete task");
      await fetchTodos();
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (todo: TodoItem) => {
    setEditId(todo.id);
    setEditTitle(todo.title);
    setEditPriority(String(todo.priority));
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditTitle("");
    setEditPriority("");
  };

  const handleEditSave = async (id: number) => {
    const prio = parseInt(editPriority, 10);
    if (!editTitle.trim() || !editPriority || isNaN(prio) || prio <= 0) {
      setError("Please enter a valid title and a positive integer priority.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, priority: prio }),
      });
      if (!res.ok) throw new Error("Failed to update task");
      setEditId(null);
      setEditTitle("");
      setEditPriority("");
      await fetchTodos();
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const sortedTodos = [...todos].sort((a, b) => a.priority - b.priority);
  const missingPriorities = getMissingPriorities(todos);

  return (
    <main className="max-w-4xl w-full mx-auto mt-10 p-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Startup TODO List</h1>

      <form onSubmit={handleAdd} className="flex gap-2 mb-8 flex-wrap">
        <input
          className="flex-1"
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          className="w-24"
          type="number"
          min={1}
          placeholder="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>Add</button>
      </form>

      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading && <div className="text-gray-700 mb-4">Loading...</div>}

      <div className="mb-6">
        <h2 className="font-semibold mb-2 text-lg">Current TODOs</h2>
        {sortedTodos.length === 0 ? (
          <div className="text-gray-700">No items yet.</div>
        ) : (
          <ul>
            {sortedTodos.map((todo) => (
              <li key={todo.id} className="todo-card">
                {editId === todo.id ? (
                  <>
                    <input
                      className="flex-1 mr-2 border px-2 py-1 rounded"
                      type="text"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      disabled={loading}
                      required
                      style={{ minWidth: 120 }}
                    />
                    <input
                      className="w-20 mr-2 border px-2 py-1 rounded"
                      type="number"
                      min={1}
                      value={editPriority}
                      onChange={e => setEditPriority(e.target.value)}
                      disabled={loading}
                      required
                    />
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded mr-2"
                      onClick={() => handleEditSave(todo.id)}
                      disabled={loading}
                      aria-label="Save"
                      type="button"
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-300 text-gray-800 px-3 py-1 rounded"
                      onClick={handleEditCancel}
                      disabled={loading}
                      aria-label="Cancel"
                      type="button"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span>
                      <span className="priority-badge">{todo.priority}</span>
                      {todo.title}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: 8 }}>
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleEdit(todo)}
                        aria-label={`Edit ${todo.title}`}
                        disabled={loading}
                        type="button"
                        style={{ verticalAlign: "middle" }}
                      >
                        <FaPencilAlt size={16} />
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(todo.id)}
                        aria-label={`Delete ${todo.title}`}
                        disabled={loading}
                        type="button"
                      >
                        Delete
                      </button>
                    </span>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8">
        <h2 className="font-semibold mb-2 text-lg">Missing Priorities</h2>
        {missingPriorities.length === 0 ? (
          <span className="text-gray-700">None 🎉</span>
        ) : (
          <span className="text-gray-700">{missingPriorities.join(", ")}</span>
        )}
      </div>
    </main>
  );
}

export default Home;
