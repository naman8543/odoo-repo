import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/clerk-react';
import Header from '@/components/custom/Header';
import RichTextEditor from '@/components/custom/RichTextEditor';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

const TAGS = ["Recursion", "Array", "Linked List", "DP", "Graph", "Hashing", "Sorting", "Heap", "Trie"];

function Home() {
  const { user } = useUser();
  const currentUser = user?.emailAddresses?.[0]?.emailAddress || user?.username || user?.id || null;

  const initialQuestions = [
    { title: "What is recursion?", description: "How does recursion work and where is it useful?", tags: ["Recursion"] },
    { title: "Difference between Array and Linked List?", description: "Which one is better for insertions?", tags: ["Array", "Linked List"] },
    { title: "What is Dynamic Programming?", description: "How is it different from recursion?", tags: ["DP"] },
    { title: "Explain Hash Tables", description: "How do hash functions work?", tags: ["Hashing"] },
    { title: "What is a Graph?", description: "Explain BFS and DFS with use-cases.", tags: ["Graph"] },
    { title: "Sorting Algorithms", description: "Compare Merge Sort and Quick Sort.", tags: ["Sorting"] },
    { title: "What is Backtracking?", description: "How is it used in N-Queens problem?", tags: ["Recursion"] },
    { title: "Best data structure for LRU cache?", description: "How to implement LRU efficiently?", tags: ["Hashing", "Linked List"] },
    { title: "When to use Dynamic Programming?", description: "Identify DP from problem statement.", tags: ["DP"] },
    { title: "Difference between Stack and Queue?", description: "When to use which one?", tags: ["Array"] },
    { title: "Advantages of Linked Lists", description: "Over arrays and when to use them?", tags: ["Linked List"] },
    { title: "Cycle detection in Graph", description: "Using DFS and Union-Find approach.", tags: ["Graph"] },
    { title: "Heap vs Binary Search Tree", description: "Which is better for priority queue?", tags: ["Sorting"] },
    { title: "Kadane’s Algorithm", description: "How to find max subarray sum?", tags: ["DP"] },
    { title: "What is a Trie?", description: "Explain trie data structure and usage.", tags: ["Hashing"] },
    { title: "Quick Sort worst case?", description: "Explain pivot strategies to avoid it.", tags: ["Sorting"] },
    { title: "What is Topological Sort?", description: "Use-cases of topological ordering.", tags: ["Graph"] },
    { title: "Sliding Window Technique", description: "When and how to apply it?", tags: ["Array"] },
    { title: "Two Pointer Technique", description: "Explain its application in problems.", tags: ["Array"] },
    { title: "Floyd’s Cycle Detection", description: "Detect cycle in linked list.", tags: ["Linked List"] },
    { title: "0/1 Knapsack Problem", description: "Classic DP approach explained.", tags: ["DP"] },
    { title: "Minimum Spanning Tree", description: "Prim’s vs Kruskal’s algorithm.", tags: ["Graph"] }
  ].map(q => ({
    ...q,
    id: uuidv4(),
    user: "Admin",
    answers: []
  }));

  const [allQuestions, setAllQuestions] = useState(initialQuestions);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedIndexes, setExpandedIndexes] = useState([]);
  const [showAskModal, setShowAskModal] = useState(false);
  const [showAnswerInputs, setShowAnswerInputs] = useState({});
  const [filterDropdown, setFilterDropdown] = useState(false);
  const [filterTag, setFilterTag] = useState(null);
  const [filterMode, setFilterMode] = useState("all");

  const [newQuestion, setNewQuestion] = useState({
    title: '',
    description: '',
    tags: [],
    user: currentUser || "Guest",
  });

  const questionsPerPage = 4;
  const filtered = allQuestions
    .filter(q => !filterTag || q.tags.includes(filterTag))
    .filter(q => filterMode !== "unanswered" || q.answers.length === 0)
    .sort((a, b) => filterMode === "newest" ? b.id.localeCompare(a.id) : 0);

  const totalPages = Math.ceil(filtered.length / questionsPerPage);
  const paginated = filtered.slice((currentPage - 1) * questionsPerPage, currentPage * questionsPerPage);

  const handleToggleAnswers = (qid) => {
    setExpandedIndexes(prev => prev.includes(qid) ? prev.filter(i => i !== qid) : [...prev, qid]);
  };

  const handleAddAnswer = (qid, text) => {
  if (!text.trim()) return;
  setAllQuestions(prev => {
    const updated = prev.map(q => {
      if (q.id === qid) {
        const updatedAnswers = [...q.answers, {
          id: uuidv4(),
          text,
          user: currentUser || "Guest",
          likes: 0,
          dislikes: 0,
          voters: {}
        }];
        return { ...q, answers: updatedAnswers };
      }
      return q;
    });
    return [...updated]; // Forces re-render
  });
  setShowAnswerInputs(prev => ({ ...prev, [qid]: false }));
};


  const handleSubmitQuestion = () => {
    const { title, description, tags } = newQuestion;
    if (!title.trim() || !description.trim() || tags.length === 0) return alert("Fill all fields");
    const newQ = { ...newQuestion, id: uuidv4(), answers: [], user: currentUser || "Guest" };
    setAllQuestions([newQ, ...allQuestions]);
    setNewQuestion({ title: '', description: '', tags: [], user: currentUser || "Guest" });
    setShowAskModal(false);
    setCurrentPage(1);
  };

  const handleVote = (qId, aId, type) => {
    setAllQuestions(prev => prev.map(q => {
      if (q.id !== qId) return q;
      const updatedAnswers = q.answers.map(a => {
        if (a.id !== aId) return a;
        const voters = { ...a.voters };
        const prevVote = voters[currentUser];
        let likes = a.likes;
        let dislikes = a.dislikes;
        if (prevVote === type) {
          if (type === 'like') likes--; else dislikes--;
          delete voters[currentUser];
        } else {
          if (prevVote === 'like') likes--;
          if (prevVote === 'dislike') dislikes--;
          if (type === 'like') likes++; else dislikes++;
          voters[currentUser] = type;
        }
        return { ...a, likes, dislikes, voters };
      });
      updatedAnswers.sort((a, b) => b.likes - a.likes);
      return { ...q, answers: updatedAnswers };
    }));
  };

  return (
    <div className="min-h-screen bg-green-50 px-4 py-6">
      <Header />
      <div className="max-w-6xl mx-auto mt-3">
        {/* Filter + Ask */}
        <div className="flex flex-wrap gap-2 items-center mb-6 bg-white shadow-md p-4 rounded-lg">
          <button onClick={() => { setFilterMode("newest"); setCurrentPage(1); }} className={`px-4 py-2 rounded ${filterMode === "newest" ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-green-200'}`}>Newest</button>
          <button onClick={() => { setFilterMode("unanswered"); setCurrentPage(1); }} className={`px-4 py-2 rounded ${filterMode === "unanswered" ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-green-200'}`}>Unanswered</button>
          <div className="relative">
            <button onClick={() => setFilterDropdown(!filterDropdown)} className="px-4 py-2 bg-gray-100 hover:bg-blue-100 rounded">Filter by Tags ⏷</button>
            {filterDropdown && (
              <div className="absolute bg-white border mt-2 rounded shadow-md z-20">
                {TAGS.map(tag => (
                  <button key={tag} onClick={() => { setFilterTag(tag); setFilterDropdown(false); setCurrentPage(1); }} className="block px-4 py-2 w-full text-left hover:bg-gray-100">{tag}</button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => { setFilterTag(null); setFilterMode("all"); setCurrentPage(1); }} className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded">Clear Filters</button>
          <div className="ml-auto">
            <button onClick={() => setShowAskModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">+ Ask Question</button>
          </div>
        </div>

        {/* Ask Modal */}
        {showAskModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <Header />
              <h2 className="text-xl font-semibold mb-4 mt-4">Ask a Question</h2>
              <input className="w-full border rounded px-3 py-2 mb-3" placeholder="Title" value={newQuestion.title} onChange={e => setNewQuestion({ ...newQuestion, title: e.target.value })} />
              <RichTextEditor value={newQuestion.description} onChange={val => setNewQuestion({ ...newQuestion, description: val })} />
              <div className="flex flex-wrap gap-2 mb-3 mt-3">
                {TAGS.map(tag => (
                  <label key={tag} className="text-sm">
                    <input type="checkbox" className="mr-1" checked={newQuestion.tags.includes(tag)} onChange={() => {
                      const tags = newQuestion.tags.includes(tag) ? newQuestion.tags.filter(x => x !== tag) : [...newQuestion.tags, tag];
                      setNewQuestion({ ...newQuestion, tags });
                    }} />
                    {tag}
                  </label>
                ))}
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowAskModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button onClick={handleSubmitQuestion} className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
              </div>
            </div>
          </div>
        )}

        {/* Questions */}
        {paginated.map(q => (
          <div key={q.id} className="bg-white shadow p-5 rounded-lg border border-green-100 mb-4">
            <h3 className="text-lg font-semibold text-green-700">{q.title}</h3>
            <p className="text-gray-700 mb-2" dangerouslySetInnerHTML={{ __html: q.description }} />
            <div className="flex flex-wrap gap-2 mb-2">
              {q.tags.map(t => <span key={t} className="px-2 py-1 text-sm bg-green-100 rounded-full">{t}</span>)}
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>By {q.user}</span>
              <div className="flex gap-3">
                <Button onClick={() => handleToggleAnswers(q.id)} className="text-white bg-green-700 rounded-full">
                  {q.answers.length} Answer{q.answers.length !== 1 ? 's' : ''}
                </Button>
                {q.user === currentUser && (
                  <button onClick={() => window.confirm("Delete this question?") && setAllQuestions(allQuestions.filter(item => item.id !== q.id))} className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded text-sm transition rounded-full">Delete</button>
                )}
              </div>
            </div>

            {expandedIndexes.includes(q.id) && (
              <div className="mt-4 space-y-3">
                {currentUser ? (
                  <>
                    {q.answers.length > 0 ? (
                      q.answers.map(ans => (
                        <div key={ans.id} className="bg-gray-100 p-3 rounded shadow-sm flex flex-col sm:flex-row justify-between">
                          <div>
                            <p>{ans.text}</p>
                            <p className="text-xs text-gray-500 mt-1">— {ans.user}</p>
                          </div>
                          <div className="flex gap-3 mt-2 sm:mt-0 sm:ml-4">
                            <button onClick={() => handleVote(q.id, ans.id, 'like')} className="flex items-center gap-1 text-green-700"><FaThumbsUp /> {ans.likes}</button>
                            <button onClick={() => handleVote(q.id, ans.id, 'dislike')} className="flex items-center gap-1 text-red-600"><FaThumbsDown /> {ans.dislikes}</button>
                            {ans.user === currentUser && (
                              <button
                                onClick={() =>
                                  window.confirm("Delete this answer?") &&
                                  setAllQuestions(prev =>
                                    prev.map(qq =>
                                      qq.id !== q.id
                                        ? qq
                                        : {
                                            ...qq,
                                            answers: qq.answers.filter(a => a.id !== ans.id),
                                          }
                                    )
                                  )
                                }
                                className="text-sm bg-green-700 text-white px-2 py-1 rounded hover:bg-green-800 transition"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="italic text-green-700">No answers yet.</p>
                    )}
                    {!showAnswerInputs[q.id] ? (
                      <Button onClick={() => setShowAnswerInputs({ ...showAnswerInputs, [q.id]: true })} className="text-sm text-white bg-green-700">Add Answer</Button>
                    ) : (
                      <div className="flex gap-2 mt-2">
                        <input type="text" className="flex-1 px-2 py-1 border rounded" placeholder="Your answer..." onKeyDown={e => e.key === 'Enter' && handleAddAnswer(q.id, e.target.value)} />
                        <button onClick={e => handleAddAnswer(q.id, e.target.previousSibling.value)} className="px-3 py-1 bg-green-700 text-white rounded text-sm">Submit</button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm italic text-green-600">Please sign in to view and add answers.</p>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-10">
          <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="px-3 py-1 border rounded">{'<'}</button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-green-600 text-white' : ''}`}>{i + 1}</button>
          ))}
          <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="px-3 py-1 border rounded">{'>'}</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
