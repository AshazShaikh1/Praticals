// src/pages/SubjectPage.jsx

import { useEffect, useState } from 'react';
import { useParams, Link, Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

// Import the content components
import SubjectQBank from './SubjectQBank';
import SubjectAssignments from './SubjectAssignments'; 

export default function SubjectPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  // Logic to transform slug (e.g., 'data-structures') back to Subject Name ('Data Structures')
  const subjectName = slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ').replace(/Toc/g, 'TOC').replace(/Evs/g, 'EVS');

  const [subjectId, setSubjectId] = useState(null);
  const [loading, setLoading] = useState(true);
  // Tracks if the Supabase ID lookup operation has completed (resolved or failed)
  const [isIdResolved, setIsIdResolved] = useState(false); 

  // 1. Fetch Subject ID from Supabase
  useEffect(() => {
    setLoading(true);
    setIsIdResolved(false);

    supabase
      .from('subjects')
      .select('id')
      .eq('name', subjectName) 
      .single()
      .then(({ data: subjectData, error: subjectError }) => {
        if (subjectError || !subjectData) {
          console.error('Error fetching subject ID:', subjectError?.message);
          setSubjectId(null);
        } else {
          setSubjectId(subjectData.id);
        }
        
        setLoading(false);
        setIsIdResolved(true); // ID determination is complete

        // Redirect to /qb as the default tab if navigating to the root subject path
        if (location.pathname === `/subject/${slug}`) {
            navigate(`/subject/${slug}/qb`, { replace: true });
        }
      });
  }, [slug, subjectName, navigate]);
  
  const basePath = `/subject/${slug}`;

  // RENDER GUARD: This prevents the blank screen issue
  if (loading || !isIdResolved) {
    return (
        <div style={{ padding: '20px' }}>
            <h2>{subjectName}</h2>
            <p>Loading subject details...</p>
        </div>
    );
  }
  
  // RENDER ERROR: Show a specific message if the subject doesn't exist
  if (subjectId === null && isIdResolved) {
       return (
        <div style={{ padding: '20px' }}>
            <h2>Error: Subject Not Found</h2>
            <p>Could not find metadata for subject: **{subjectName}**. Please ensure the subject is correctly spelled in the URL and exists in your Supabase `subjects` table.</p>
            <p><Link to="/">← Back to Subjects</Link></p>
        </div>
    );
  }

  // --- Rendered when subjectId is successfully found ---
  const contentProps = { subjectId, slug, subjectName };

  return (
    <div>
      <p><Link to="/">← Back to Subjects</Link></p>
      <h1 style={{ marginTop: '8px' }}>{subjectName}</h1>

      {/* --- Sub-Navigation Menu --- */}
      <div className="nav-menu" style={{ marginTop: '8px' }}>
        <Link to={`${basePath}/qb`}>Question Bank</Link>
        <Link to={`${basePath}/assignments`}>Assignments</Link>
      </div>

      {/* --- Nested Routes for Content --- */}
      <Routes>
        <Route path="qb" element={<SubjectQBank {...contentProps} />} />
        <Route path="assignments" element={<SubjectAssignments {...contentProps} />} />
        <Route path="/" element={<div style={{ padding: '20px 0' }}><p>Select a tab above to view content.</p></div>} />
      </Routes>
    </div>
  );
}