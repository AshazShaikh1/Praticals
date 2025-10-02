import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../supabase'; 
import { Link } from 'react-router-dom';
import Accordion from '../components/Accordion';
import FileRenderer from '../components/FileRenderer';
import Notice from '../components/Notice';
import { STORAGE_BUCKET_NAME, removeFromStorageIfPublicUrl } from '../utils/storage';


export default function SubjectAssignments({ subjectId, slug, subjectName }) {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [notice, setNotice] = useState(null); // { type: 'error'|'success'|'info', message: string }
    
    // Form states for adding a new assignment
    const [newTitle, setNewTitle] = useState('');
    const [newFile, setNewFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Check for active Supabase session
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
        return () => subscription.unsubscribe();
    }, []);

    // Fetch Assignments based on Subject ID
    const fetchAssignments = async (id) => {
        if (!id) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('assignments')
            .select('id, title, file_url')
            .eq('subject_id', id);

        if (error) console.error('Error fetching assignments:', error.message);
        else setAssignments(data || []);
        
        setLoading(false);
    };
    
    // FIX: Only fetch when subjectId is available
    useEffect(() => {
        if (subjectId) {
            fetchAssignments(subjectId);
        }
    }, [subjectId]);

    // Implement Search Feature
    const filteredAssignments = useMemo(() => {
        if (!searchTerm) return assignments;
        const lowerCaseSearch = searchTerm.toLowerCase();
        return assignments.filter(a => 
            a.title.toLowerCase().includes(lowerCaseSearch)
        );
    }, [assignments, searchTerm]);


    // Handle new assignment submission
    const handleAddAssignment = async (e) => {
        e.preventDefault();
        if (!newTitle.trim() || !newFile) {
            setNotice({ type: 'error', message: 'Title and file are required.' });
            return;
        }
        if (!subjectId || !session) {
            setNotice({ type: 'error', message: 'Please log in to add assignments.' });
            setUploading(false);
            return;
        }

        setUploading(true);
        
        // 1. Upload File to Supabase Storage
        const fileExt = newFile.name.split('.').pop();
        const fileName = `${slug}-assignment-${Date.now()}.${fileExt}`;
        const filePath = `assignments/${slug}/${fileName}`; 

        const { error: uploadError } = await supabase.storage
            .from(STORAGE_BUCKET_NAME)
            .upload(filePath, newFile);

        if (uploadError) {
            setUploading(false);
            console.error('File upload error:', uploadError);
            setNotice({ type: 'error', message: `File upload failed: ${uploadError.message}` });
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from(STORAGE_BUCKET_NAME)
            .getPublicUrl(filePath);

        // 2. Insert metadata into the assignments table
        const { error: insertError } = await supabase
            .from('assignments')
            .insert({
                subject_id: subjectId,
                title: newTitle.trim(),
                file_url: publicUrl,
            });

        setUploading(false);

        if (insertError) {
            console.error('Insert error:', insertError);
            setNotice({ type: 'error', message: `Failed to save assignment details: ${insertError.message}` });
            return;
        }
        
        // Success: Clear form and refresh list
        setNewTitle('');
        setNewFile(null);
        if (document.getElementById('assignment-file')) {
            document.getElementById('assignment-file').value = null;
        }
        fetchAssignments(subjectId);
        setNotice({ type: 'success', message: 'Assignment successfully added.' });
    };

    const handleDeleteAssignment = async (assignmentId, fileUrl) => {
        if (!session) {
            setNotice({ type: 'error', message: 'You must be logged in to delete.' });
            return;
        }

        // Try to remove storage object if this is a file URL from our bucket
        const { error: removeErr } = await removeFromStorageIfPublicUrl(fileUrl);
        if (removeErr) {
            console.error('Storage remove error:', removeErr);
            setNotice({ type: 'error', message: `Failed to remove file from storage: ${removeErr.message}` });
            // Continue regardless to attempt DB delete
        }

        const { data: deletedRows, error: deleteErr } = await supabase
            .from('assignments')
            .delete()
            .eq('id', assignmentId)
            .eq('subject_id', subjectId)
            .select('id');

        if (deleteErr || !deletedRows || deletedRows.length === 0) {
            console.error('Delete row error:', deleteErr);
            const details = deleteErr?.message || 'Unknown error';
            const code = deleteErr?.code ? ` (${deleteErr.code})` : '';
            setNotice({ type: 'error', message: `Failed to delete assignment: ${details}${code}` });
            return;
        }

        // Optimistically update UI (match by id or file_url as fallback)
        setAssignments(prev => prev.filter(a => {
            const matchesId = typeof a.id !== 'undefined' && a.id === assignmentId;
            const matchesFile = (a.file_url && fileUrl) ? a.file_url === fileUrl : false;
            return !(matchesId || matchesFile);
        }));
        setNotice({ type: 'success', message: 'Assignment removed.' });
        // Background refresh for consistency
        fetchAssignments(subjectId);
    };

    const renderAssignmentList = () => {
        if (loading) {
            return <p>Loading assignments...</p>;
        }

        if (filteredAssignments.length === 0) {
            if (searchTerm) {
                return <p>No assignments matched your search term.</p>;
            }
            if (assignments.length === 0) {
                return <p>No assignments have been uploaded for {subjectName} yet.</p>;
            }
            return <p>No assignments to display.</p>;
        }

        // Display results (filtered or full list)
        return filteredAssignments.map((assignment) => {
            const key = typeof assignment.id !== 'undefined' ? `a-${assignment.id}` : `a-${assignment.title}-${assignment.file_url || 'nofile'}`;
            return (
            <Accordion key={key} title={assignment.title}>
                <FileRenderer content={assignment.file_url} title={assignment.title} />
                {session && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                        <button
                            type="button"
                            onClick={() => handleDeleteAssignment(assignment.id, assignment.file_url)}
                            style={{ background: '#fff', color: '#991b1b', border: '1px solid #fecaca' }}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </Accordion>
        );
        });
    };


    return (
        <div style={{ padding: '20px 0' }}>
        <p><Link to={`/subject/${slug}`}>← Back to {subjectName} Menu</Link></p>
        
        <h2>{subjectName} Assignments</h2>

        {/* Inline notice */}
        {notice && (
            <Notice type={notice.type} message={notice.message} onClose={() => setNotice(null)} />
        )}

        {/* Add New Assignment Form */}
        <section>
            <h3>Add New Assignment (Login required)</h3>
            
            {!session ? (
                <div style={{ padding: '12px', background: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: '8px' }}>
                    Please <Link to="/auth">Log In</Link> to add new assignments.
                </div>
            ) : (
                <form onSubmit={handleAddAssignment} style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px', background: '#fff' }}>
                    <input 
                        type="text"
                        placeholder="Assignment Title (e.g., Practical 5 Report)" 
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        disabled={uploading}
                    />
                    <input 
                        type="file"
                        id="assignment-file"
                        onChange={(e) => setNewFile(e.target.files?.[0] || null)}
                        disabled={uploading}
                    />
                    <button type="submit" disabled={uploading || !newFile || !newTitle}>
                        {uploading ? 'Uploading & Adding...' : 'Add Assignment'}
                    </button>
                </form>
            )}
        </section>
        {/* List Assignments */}
        <section style={{ marginBottom: '30px' }}>
            <h3>Search & View Existing Assignments</h3>
            
            <input 
            type="text"
            placeholder={`Search assignments by title...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <div style={{ marginTop: '10px' }}>
                {renderAssignmentList()}
            </div>
        </section>
        </div>
    );
}