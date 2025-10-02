import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

export default function Home() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubjects() {
      // ... (Supabase fetching logic remains the same)
      const { data, error } = await supabase
        .from('subjects')
        .select('id, name');
      
      setLoading(false);

      if (error) {
        console.error('Error fetching subjects:', error.message);
        return;
      }
      
      if (data) {
        const subjectsWithSlugs = data.map(sub => ({
          ...sub, 
          slug: sub.name.toLowerCase().replace(/ \(.+\)/g, '').replace(/ /g, '-')
        }));
        setSubjects(subjectsWithSlugs);
      }
    }
    fetchSubjects(); 
  }, []);

  return (
    <div>
      <h1>Subjects</h1>
      <p>Select a subject below to view practicals and contribute content.</p>

      {loading ? (
        <div style={{
          padding: '18px',
          background: '#fff',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          Loading subjects...
        </div>
      ) : subjects.length === 0 ? (
        <div style={{
          padding: '18px',
          background: '#fff',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          No subjects found. Please check database connection and policies.
        </div>
      ) : (
        <ul className="subject-list" style={{ marginTop: '18px' }}>
          {subjects.map(subject => (
            <li key={subject.id}>
              <Link to={`/subject/${subject.slug}`} className="subject-card">
                {subject.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}