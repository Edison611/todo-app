
"use client";
import React, { useState, useEffect } from "react";

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

  console.log(todos)

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

  const sortedTodos = [...todos].sort((a, b) => a.priority - b.priority);
  const missingPriorities = getMissingPriorities(todos);

  return (
    <main className="max-w-xl mx-auto mt-10 p-6">
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
                <span>
                  <span className="priority-badge">{todo.priority}</span>
                  {todo.title}
                </span>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(todo.id)}
                  aria-label={`Delete ${todo.title}`}
                  disabled={loading}
                >
                  Delete
                </button>
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
