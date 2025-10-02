import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../supabase'; 
import { Link } from 'react-router-dom';
import Accordion from '../components/Accordion';
import FileRenderer from '../components/FileRenderer';
import Notice from '../components/Notice';
import { STORAGE_BUCKET_NAME, removeFromStorageIfPublicUrl } from '../utils/storage';

export default function SubjectQBank({ subjectId, slug, subjectName }) {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Form states for adding a new question/file
    const [newQuestionText, setNewQuestionText] = useState(''); 
    const [newAnswerText, setNewAnswerText] = useState('');     
    const [newFileTitle, setNewFileTitle] = useState('');       
    const [newFile, setNewFile] = useState(null);               
    const [inserting, setInserting] = useState(false);
    const [notice, setNotice] = useState(null); // { type: 'error'|'success'|'info', message: string }

    // Check for active Supabase session
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
        return () => subscription.unsubscribe();
    }, []);

    // Fetch Question Bank based on Subject ID
    const fetchQuestions = async (id) => {
        if (!id) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('question_bank')
            .select('id, question, answer') 
            .eq('subject_id', id);

        if (error) console.error('Error fetching questions:', error.message);
        else setQuestions(data || []);
        
        setLoading(false);
    };
    
    // FIX: Only fetch when subjectId is available
    useEffect(() => {
        if (subjectId) {
            fetchQuestions(subjectId);
        }
    }, [subjectId]);

    // Implement Search Feature
    const filteredQuestions = useMemo(() => {
        if (!searchTerm) return questions;
        const lowerCaseSearch = searchTerm.toLowerCase();
        return questions.filter(q => 
            q.question.toLowerCase().includes(lowerCaseSearch) || 
            q.answer?.toLowerCase().includes(lowerCaseSearch) 
        );
    }, [questions, searchTerm]);
    
    const clearForm = () => {
        setNewQuestionText('');
        setNewAnswerText('');
        setNewFileTitle('');
        setNewFile(null);
        if (document.getElementById('qb-file')) {
            document.getElementById('qb-file').value = null;
        }
    };

    // Handle new question submission (Text OR File)
    const handleAddQuestion = async (e) => {
        e.preventDefault();
        if (!subjectId || !session) {
            setNotice({ type: 'error', message: 'Please log in to add content.' });
            setInserting(false);
            return;
        }
        
        setInserting(true);
        let questionToInsert = newQuestionText.trim();
        let answerToInsert = newAnswerText.trim();
        let isFileUpload = false;
        
        if (newFile) {
            if (!newFileTitle.trim()) {
                setNotice({ type: 'error', message: 'File upload requires a title.' });
                setInserting(false);
                return;
            }
            
            // 1. Upload File to Supabase Storage
            const fileExt = newFile.name.split('.').pop();
            const fileName = `${slug}-qb-${Date.now()}.${fileExt}`;
            const filePath = `question_bank/${slug}/${fileName}`; 

            const { error: uploadError } = await supabase.storage
                .from(STORAGE_BUCKET_NAME)
                .upload(filePath, newFile);

            if (uploadError) {
                setInserting(false);
                console.error('File upload error:', uploadError);
                setNotice({ type: 'error', message: `File upload failed: ${uploadError.message}` });
                return;
            }

            const { data: { publicUrl } } = supabase.storage
                .from(STORAGE_BUCKET_NAME)
                .getPublicUrl(filePath);

            questionToInsert = newFileTitle.trim();
            answerToInsert = publicUrl;
            isFileUpload = true;

        } else {
            if (!newQuestionText.trim() || !newAnswerText.trim()) {
                setNotice({ type: 'error', message: 'Both question and answer are required for text entry.' });
                setInserting(false);
                return;
            }
        }
        
        // 2. Insert metadata into the question_bank table
        const { error: insertError } = await supabase
            .from('question_bank')
            .insert({
                subject_id: subjectId,
                question: questionToInsert,
                answer: answerToInsert,
            });

        setInserting(false);

        if (insertError) {
            console.error('Insert error:', insertError);
            setNotice({ type: 'error', message: `Failed to save content: ${insertError.message}` });
            return;
        }
        
        clearForm();
        fetchQuestions(subjectId); 
        setNotice({ type: 'success', message: `Content successfully added (${isFileUpload ? 'File' : 'Text'}).` });
    };
    
    const isFileMode = newFile !== null;
    
    const handleDeleteQuestion = async (questionId, answerValue) => {
        if (!session) {
            setNotice({ type: 'error', message: 'You must be logged in to delete.' });
            return;
        }

        // If answer is a public URL to storage, attempt to remove file
        const { error: removeErr } = await removeFromStorageIfPublicUrl(answerValue);
        if (removeErr) {
            console.error('Storage remove error:', removeErr);
            setNotice({ type: 'error', message: `Failed to remove file from storage: ${removeErr.message}` });
            // continue to DB delete attempt
        }

        const { data: deletedRows, error: deleteErr } = await supabase
            .from('question_bank')
            .delete()
            .eq('id', questionId)
            .eq('subject_id', subjectId)
            .select('id');

        if (deleteErr || !deletedRows || deletedRows.length === 0) {
            console.error('Delete row error:', deleteErr);
            const details = deleteErr?.message || 'Unknown error';
            const code = deleteErr?.code ? ` (${deleteErr.code})` : '';
            setNotice({ type: 'error', message: `Failed to delete entry: ${details}${code}` });
            return;
        }

        // Optimistically update UI (match by id or exact question/answer fallback)
        setQuestions(prev => prev.filter(q => {
            const matchesId = typeof q.id !== 'undefined' && q.id === questionId;
            const matchesPair = (q.answer && answerValue) ? q.answer === answerValue : false;
            return !(matchesId || matchesPair);
        }));
        setNotice({ type: 'success', message: 'Entry removed.' });
        // Background refresh for consistency
        fetchQuestions(subjectId);
    };

    const renderQuestionList = () => {
        if (loading) {
            return <p>Loading content...</p>;
        }
        
        if (filteredQuestions.length === 0) {
            if (searchTerm) {
                return <p>No content matched your search term.</p>;
            }
            // Initial empty state
            if (questions.length === 0) {
                return <p>No content has been added to the {subjectName} Question Bank yet.</p>;
            }
            // Should not happen, but a fallback
            return <p>No questions to display.</p>;
        }

        // Display results (filtered or full list)
        return filteredQuestions.map((q) => {
            const key = typeof q.id !== 'undefined' ? `q-${q.id}` : `q-${q.question}-${q.answer || 'noanswer'}`;
            return (
            <Accordion key={key} title={q.question}>
                <FileRenderer content={q.answer} title={q.question} />
                {session && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                        <button
                            type="button"
                            onClick={() => handleDeleteQuestion(q.id, q.answer)}
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
        
        <h2>{subjectName} Question Bank</h2>

        {/* Inline notice */}
        {notice && (
            <Notice type={notice.type} message={notice.message} onClose={() => setNotice(null)} />
        )}

        {/* Add New Question Form */}
        <section style={{ marginBottom: '30px' }}>
            <h3>Add New QB Entry (Login required)</h3>
            
            {!session ? (
                <div style={{ padding: '12px', background: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: '8px' }}>
                    Please <Link to="/auth">Log In</Link> to add new questions or files.
                </div>
            ) : (
                <form onSubmit={handleAddQuestion} style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px', background: '#fff' }}>
                    
                    {/* File Upload Fields */}
                    <input 
                        type="text"
                        placeholder="Title/Description for File (e.g., VIVA Questions PDF)" 
                        value={newFileTitle}
                        onChange={(e) => setNewFileTitle(e.target.value)}
                        disabled={inserting || (isFileMode ? false : newQuestionText.trim() || newAnswerText.trim())}
                    />
                    <input 
                        type="file"
                        id="qb-file"
                        onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setNewFile(file);
                            // If file selected, clear text fields
                            if(file) { setNewQuestionText(''); setNewAnswerText(''); } else { setNewFileTitle(''); }
                        }}
                        disabled={inserting || (newQuestionText.trim() || newAnswerText.trim())}
                    />
                    
                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={inserting || !(newFile || (newQuestionText.trim() && newAnswerText.trim()))}
                    >
                        {inserting ? 'Saving Content...' : 'Add QB'}
                    </button>
                    
                </form>
            )}
        </section>
        
        {/* List Question Bank */}
        <section>
            <h3>Search & View Questions</h3>
            
            <input 
            type="text"
            placeholder={`Search inside ${subjectName} content...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <div style={{ marginTop: '10px' }}>
                {renderQuestionList()}
            </div>
        </section>
        </div>
    );
}