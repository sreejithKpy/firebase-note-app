import { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
function MyComponent() {
  const [text, setText] = useState("");
  const [notes, setNotes] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    setLoading(true);
    try {
      const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const noteData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(noteData);
      setNotes(noteData);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function addNote() {
    if (text.trim() === "") return;
    try {
      await addDoc(collection(db, "notes"), {
        text: text,
        createdAt: Date.now(),
      });

      fetchNotes();
      setText("");
    } catch (err) {
      console.log(err.message);
    }
  }

  async function deleteTask(id) {
    const confirmDel = window.confirm(
      "Are you sure you want to delete this note?",
    );

    if (!confirmDel) return;

    try {
      await deleteDoc(doc(db, "notes", id));
      fetchNotes();
    } catch (err) {
      console.log(err.message);
    }
  }
  function editTask(note) {
    setText(note.text);
    setEditIndex(note.id);
  }
  async function saveTask() {
    if (text.trim() === "") return;
    try {
      await updateDoc(doc(db, "notes", editIndex), {
        text: text,
      });

      fetchNotes();
      setText("");
      setEditIndex(null);
    } catch (err) {
      console.log(err.message);
    }
  }
  async function clearAll() {
    const confirmClear = window.confirm(
      "Are you sure you want to purge all notes?",
    );

    if (!confirmClear) return;

    try {
      for (const note of notes) {
        await deleteDoc(doc(db, "notes", note.id));
      }
      await fetchNotes();

      setText("");
      setEditIndex(null);
    } catch (err) {
      console.log(err.message);
    }
  }

  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="notes-page-wrapper">
      <div className="notes-container">
        <div className="notes-header">
          <h1>Joyboy's Journal</h1>
          <p>Forge your thoughts into permanent archive</p>
        </div>
        <div className="notes-search-box">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search through archives..."
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="notes-creator-card">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your note here..."
            rows="4"
          ></textarea>

          <div className="notes-btn-group">
            <button
              className={
                editIndex === null ? "notes-add-btn" : "notes-save-btn"
              }
              onClick={editIndex === null ? addNote : saveTask}
            >
              {editIndex === null ? "✍️ Add Note" : "💾 Save Changes"}
            </button>
            {notes.length > 0 && (
              <button className="notes-clear-btn" onClick={clearAll}>
                💥 Clear All
              </button>
            )}
          </div>
        </div>
        {loading && (
          <div className="notes-loading">Loading secure archives...</div>
        )}

        {!loading && notes.length === 0 && (
          <div className="notes-empty-state">
            <h2>No Notes Found 📝</h2>
            <p>The vault is empty. Forge your very first note above.</p>
          </div>
        )}

        <div className="notes-grid">
          {filteredNotes.map((note) => (
            <div className="note-card" key={note.id}>
              <p className="note-card-text">{note.text}</p>
              <div className="note-card-actions">
                <button
                  className="card-edit-btn"
                  onClick={() => editTask(note)}
                >
                  🖋️ Edit
                </button>
                <button
                  className="card-delete-btn"
                  onClick={() => deleteTask(note.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default MyComponent;
