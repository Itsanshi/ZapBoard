'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TASK_COMMENTS, ADD_TASK_COMMENT } from '@/lib/graphql';
import { TaskComment, CreateCommentForm } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { Send, MessageSquare } from 'lucide-react';

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

  if (loading) return <div className="animate-pulse h-20 bg-gray-200 rounded"></div>;
  if (error) return <div className="text-red-600 text-sm">Error loading comments: {error.message}</div>;

  return (
    <div className="space-y-4">
      {/* Comments Header */}
      <div className="flex items-center space-x-2">
        <MessageSquare className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{comment.authorEmail}</span>
                <span className="text-sm text-gray-500">
                  {formatDateTime(comment.timestamp)}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))
        )}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} className="space-y-3 border-t border-gray-200 pt-4">
        <h4 className="font-medium text-gray-900">Add a Comment</h4>
        
        <div>
          <label htmlFor="authorEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Your Email *
          </label>
          <input
            type="email"
            id="authorEmail"
            required
            value={commentForm.authorEmail}
            onChange={(e) => setCommentForm({ ...commentForm, authorEmail: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Comment *
          </label>
          <textarea
            id="content"
            rows={3}
            required
            value={commentForm.content}
            onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write your comment here..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={addingComment || !commentForm.content.trim() || !commentForm.authorEmail.trim()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4 mr-2" />
            {addingComment ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>
    </div>
  );
}
