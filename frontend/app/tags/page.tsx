"use client";

import { useEffect, useState } from "react";

type Tag = {
	id: number;
	name: string;
};

export default function TagsPage() {
	const [tags, setTags] = useState<Tag[]>([]);
	const [newName, setNewName] = useState("");
	const [editId, setEditId] = useState<number | null>(null);
	const [editName, setEditName] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchTags = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/tags", { cache: "no-store" });
			if (!res.ok) {
				throw new Error("Failed to fetch tags");
			}
			const data = await res.json();
			setTags(Array.isArray(data) ? data : []);
		} catch (err: any) {
			setError(err.message || "Unknown error");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchTags();
	}, []);

	const handleCreate = async (e: React.FormEvent) => {
		e.preventDefault();
		const name = newName.trim();
		if (!name) return;

		setLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/tags", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name }),
			});
			if (!res.ok) {
				throw new Error("Failed to create tag");
			}
			setNewName("");
			await fetchTags();
		} catch (err: any) {
			setError(err.message || "Unknown error");
		} finally {
			setLoading(false);
		}
	};

	const startEdit = (tag: Tag) => {
		setEditId(tag.id);
		setEditName(tag.name);
	};

	const cancelEdit = () => {
		setEditId(null);
		setEditName("");
	};

	const saveEdit = async (id: number) => {
		const name = editName.trim();
		if (!name) {
			setError("Tag name cannot be empty.");
			return;
		}

		setLoading(true);
		setError(null);
		try {
			const res = await fetch(`/api/tags/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name }),
			});
			if (!res.ok) {
				throw new Error("Failed to update tag");
			}
			cancelEdit();
			await fetchTags();
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
			const res = await fetch(`/api/tags/${id}`, { method: "DELETE" });
			if (!res.ok && res.status !== 204) {
				throw new Error("Failed to delete tag");
			}
			if (editId === id) {
				cancelEdit();
			}
			await fetchTags();
		} catch (err: any) {
			setError(err.message || "Unknown error");
		} finally {
			setLoading(false);
		}
	};

	const sortedTags = [...tags].sort((a, b) => a.name.localeCompare(b.name));

	return (
		<main className="max-w-2xl w-full mx-auto mt-10 p-10">
			<h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Tag Manager</h1>

			<form onSubmit={handleCreate} className="flex gap-2 mb-8">
				<input
					className="flex-1"
					type="text"
					placeholder="Add a new tag"
					value={newName}
					onChange={(e) => setNewName(e.target.value)}
					disabled={loading}
					required
				/>
				<button type="submit" disabled={loading || !newName.trim()}>
					Add Tag
				</button>
			</form>

			{error && <div className="text-red-600 mb-4">{error}</div>}
			{loading && <div className="text-gray-700 mb-4">Loading...</div>}

			<section>
				<h2 className="font-semibold mb-2 text-lg">Current Tags</h2>
				{sortedTags.length === 0 ? (
					<p className="text-gray-700">No tags found.</p>
				) : (
					<ul>
						{sortedTags.map((tag) => (
							<li key={tag.id} className="todo-card">
								{editId === tag.id ? (
									<>
										<input
											className="flex-1 mr-2"
											type="text"
											value={editName}
											onChange={(e) => setEditName(e.target.value)}
											disabled={loading}
											required
										/>
										<button
											type="button"
											className="bg-blue-600 text-white px-3 py-1 rounded mr-2"
											disabled={loading || !editName.trim()}
											onClick={() => saveEdit(tag.id)}
										>
											Save
										</button>
										<button
											type="button"
											className="bg-gray-300 text-gray-800 px-3 py-1 rounded"
											disabled={loading}
											onClick={cancelEdit}
										>
											Cancel
										</button>
									</>
								) : (
									<>
										<span>{tag.name}</span>
										<div className="flex gap-3">
											<button
												type="button"
												className="text-blue-600 hover:text-blue-800"
												disabled={loading}
												onClick={() => startEdit(tag)}
											>
												Edit
											</button>
											<button
												type="button"
												className="delete-btn"
												disabled={loading}
												onClick={() => handleDelete(tag.id)}
											>
												Delete
											</button>
										</div>
									</>
								)}
							</li>
						))}
					</ul>
				)}
			</section>
		</main>
	);
}
