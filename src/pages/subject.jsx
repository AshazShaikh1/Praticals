import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

const storageKey = (subject) => `notes:${subject}`

export default function Subject() {
  const { slug } = useParams()
  const subject = slug || 'unknown'

  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem(storageKey(subject))
    setNotes(raw ? JSON.parse(raw) : [])
    setEditingId(null)
    setTitle('')
    setContent('')
  }, [subject])

  useEffect(() => {
    // persist whenever notes change
    localStorage.setItem(storageKey(subject), JSON.stringify(notes))
  }, [notes, subject])

  function addNote(e) {
    e?.preventDefault()
    if (!title.trim() && !content.trim()) return
    const note = { id: Date.now(), title: title.trim(), content: content.trim() }
    setNotes(prev => [note, ...prev])
    setTitle('')
    setContent('')
  }

  function startEdit(note) {
    setEditingId(note.id)
    setTitle(note.title)
    setContent(note.content)
  }
  function saveEdit(e) {
    e?.preventDefault()
    setNotes(prev => prev.map(n => n.id === editingId ? { ...n, title, content } : n))
    setEditingId(null)
    setTitle('')
    setContent('')
  }
  function cancelEdit() {
    setEditingId(null)
    setTitle('')
    setContent('')
  }
  function deleteNote(id) {
    if (!confirm('Delete this note?')) return
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  function exportNotes() {
    const dataStr = JSON.stringify(notes, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${subject}-notes.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function importNotes(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const arr = JSON.parse(reader.result)
        if (!Array.isArray(arr)) throw new Error('Invalid file')
        setNotes(arr)
      } catch (err) {
        alert('Invalid JSON file')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div>
      <h2>{subject.charAt(0).toUpperCase() + subject.slice(1)} Notes</h2>
      <p><Link to="/">← Back to subjects</Link></p>

      <form onSubmit={editingId ? saveEdit : addNote} style={{marginBottom:12}}>
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <br />
        <textarea placeholder="Content" value={content} onChange={e=>setContent(e.target.value)} rows={6} />
        <br />
        <button type="submit">{editingId ? 'Save' : 'Add Note'}</button>
        {editingId && <button type="button" onClick={cancelEdit}>Cancel</button>}
      </form>

      <div style={{marginBottom:10}}>
        <button onClick={exportNotes}>Export notes (JSON)</button>
        <input type="file" accept=".json,application/json" onChange={importNotes} />
      </div>

      <section>
        {notes.length === 0 ? <p>No notes yet.</p> : (
          <ul>
            {notes.map(n => (
              <li key={n.id} style={{border:'1px solid #ddd', padding:8, marginBottom:8}}>
                <h3>{n.title || <em>(no title)</em>}</h3>
                <pre style={{whiteSpace:'pre-wrap'}}>{n.content}</pre>
                <div>
                  <button onClick={() => startEdit(n)}>Edit</button>
                  <button onClick={() => deleteNote(n.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
