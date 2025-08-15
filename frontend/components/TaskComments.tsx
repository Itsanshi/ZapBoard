'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TASK_COMMENTS, ADD_TASK_COMMENT } from '@/lib/graphql';
import { TaskComment, CreateCommentForm } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { Send, MessageSquare, User } from 'lucide-react';

interface TaskCommentsProps {
  taskId: string;
}

export default function TaskComments({ taskId }: TaskCommentsProps) {
  const [commentForm, setCommentForm] = useState<CreateCommentForm>({
    content: '',
    authorEmail: '',
  });

  const { data, loading, error, refetch } = useQuery(GET_TASK_COMMENTS, {
    variables: { taskId },
  });

  const [addComment, { loading: addingComment }] = useMutation(ADD_TASK_COMMENT);

  const comments: TaskComment[] = data?.taskComments || [];

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentForm.content.trim() || !commentForm.authorEmail.trim()) return;

    try {
      await addComment({
        variables: {
          taskId,
          content: commentForm.content,
          authorEmail: commentForm.authorEmail,
        },
      });

      setCommentForm({ content: '', authorEmail: '' });
      refetch();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) return (
    <div className="modern-card p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded-lg w-1/3"></div>
        <div className="h-20 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="modern-card p-6">
      <div className="text-red-600 text-sm bg-red-50 p-4 rounded-lg border border-red-200">
        Error loading comments: {error.message}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comments List with Scrolling */}
      <div className="modern-card">
        <div className="max-h-80 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {comments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">No comments yet</h4>
              <p style={{ color: 'var(--text-secondary)' }}>Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment, index) => (
              <div key={comment.id} className="animate-slide-in-right" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="modern-card-inner p-5 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{comment.authorEmail}</span>
                        <span className="text-xs px-2 py-1 rounded-full" style={{ 
                          color: 'var(--text-muted)', 
                          backgroundColor: 'var(--surface-secondary)' 
                        }}>
                          {formatDateTime(comment.timestamp)}
                        </span>
                      </div>
                      <p className="leading-relaxed break-words" style={{ color: 'var(--text-secondary)' }}>{comment.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Comment Form */}
      <div className="modern-card p-6">
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Send className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-lg">Add a Comment</h4>
          </div>
          
          <div>
            <label htmlFor="authorEmail" className="block text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Your Email *
            </label>
            <input
              type="email"
              id="authorEmail"
              required
              value={commentForm.authorEmail}
              onChange={(e) => setCommentForm({ ...commentForm, authorEmail: e.target.value })}
              className="form-input w-full px-4 py-3"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Comment *
            </label>
            <textarea
              id="content"
              rows={4}
              required
              value={commentForm.content}
              onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
              className="form-input w-full px-4 py-3 resize-none"
              placeholder="Share your thoughts, ideas, or feedback..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={addingComment || !commentForm.content.trim() || !commentForm.authorEmail.trim()}
              className="btn-primary inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Send className="w-4 h-4 mr-2" />
              {addingComment ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
