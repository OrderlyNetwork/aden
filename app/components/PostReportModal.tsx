import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { createPostReport, createCommentReport, type CreatePostReportRequest, type CreateCommentReportRequest } from '~/api/post';
import { useUserStore } from '~/store/userStore';
import { useTranslation } from '~/i18n/TranslationContext';

interface PostReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'post' | 'comment';
  // Post data
  postId?: string;
  postTitle?: string;
  postAuthorId?: string;
  postAuthorName?: string;
  // Comment data
  commentId?: string;
  commentContent?: string;
  commentAuthorId?: string;
  commentAuthorName?: string;
}

export default function PostReportModal({ 
  isOpen, 
  onClose, 
  type,
  postId,
  postTitle,
  postAuthorId,
  postAuthorName,
  commentId,
  commentContent,
  commentAuthorId,
  commentAuthorName
}: PostReportModalProps) {
  const { user } = useUserStore();
  const { t } = useTranslation();
  const [reason, setReason] = useState('');
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prevent scrolling when modal is open
  useEffect(() => {
    setMounted(true);
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setReason('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  // Close modal when clicking on the backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('로그인이 필요합니다.');
      return;
    }

    if (!reason.trim()) {
      setError('신고 사유를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (type === 'post') {
        if (!postId || !postTitle || !postAuthorId || !postAuthorName) {
          throw new Error('게시글 정보가 누락되었습니다.');
        }

        const reportData: CreatePostReportRequest = {
          post_id: postId,
          post_title: postTitle,
          reporter_id: user.user_id.toString(),
          reporter_name: user.username,
          target_user_id: postAuthorId,
          target_user_name: postAuthorName,
          reason: reason.trim(),
        };

        await createPostReport(reportData);
      } else {
        if (!commentId || !postId || !postTitle || !commentContent || !commentAuthorId || !commentAuthorName) {
          throw new Error('댓글 정보가 누락되었습니다.');
        }

        const reportData: CreateCommentReportRequest = {
          comment_id: commentId,
          post_id: postId,
          post_title: postTitle,
          comment_content: commentContent,
          reporter_id: user.user_id.toString(),
          reporter_name: user.username,
          target_user_id: commentAuthorId,
          target_user_name: commentAuthorName,
          reason: reason.trim(),
        };

        await createCommentReport(reportData);
      }
      
      // Show success message and close modal
      alert(t('post.reportSuccess'));
      onClose();
    } catch (err) {
      console.error('Report submission error:', err);
      setError(t('post.reportError'));
    } finally {
      setLoading(false);
    }
  };

  const getModalTitle = () => {
    return type === 'post' ? t('post.reportPost') : t('post.reportComment');
  };

  const getPreviewContent = () => {
    if (type === 'post') {
      return (
        <div className="dc-text-[#C1C1C1] dc-text-sm dc-mb-4">
          <span className="dc-font-bold">{postAuthorName}</span>님의 게시글:
          <div className="dc-text-white dc-text-sm dc-break-words dc-mt-2 dc-font-bold">
            {postTitle}
          </div>
        </div>
      );
    } else {
      return (
        <div className="dc-text-[#C1C1C1] dc-text-sm dc-mb-4">
          <span className="dc-font-bold">{commentAuthorName}</span>님의 댓글:
          <div className="dc-text-white dc-text-sm dc-break-words dc-mt-2">
            {commentContent}
          </div>
        </div>
      );
    }
  };

  const modalContent = (
    <div 
      className="dc-fixed dc-inset-0 dc-bg-black dc-bg-opacity-50 dc-backdrop-filter dc-backdrop-blur-lg dc-flex dc-items-center dc-justify-center dc-z-[999999]"
      onClick={handleBackdropClick}
    >
      <div className="dc-bg-gradient-to-br dc-from-[#1C1E21] dc-to-[#111316] dc-border dc-border-white dc-border-opacity-6 dc-p-24 dc-rounded-[16px] dc-max-w-md dc-w-full dc-mx-16 animate-fadeIn">
        {/* Header */}
        <div className="dc-flex dc-items-center dc-justify-between dc-mb-24">
          <h2 className="dc-text-white dc-text-xl dc-font-bold">{getModalTitle()}</h2>
          <button
            onClick={onClose}
            className="dc-text-white hover:dc-text-gray-300 dc-transition-colors"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Info */}
        <div className="dc-mb-20">
          <div className="dc-bg-[#1F2126] dc-border dc-border-[#1F2126] dc-rounded-[12px] dc-p-12 dc-mb-12">
            {getPreviewContent()}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="dc-mb-20">
            <label className="dc-block dc-text-white dc-text-sm dc-font-medium dc-mb-8">
              {t('post.reportReason')}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t('post.reportReasonPlaceholder')}
              className="dc-w-full dc-h-96 dc-px-12 dc-py-8 dc-bg-transparent dc-border dc-border-white dc-border-opacity-6 dc-rounded-lg dc-text-white placeholder-[#777777] focus:dc-outline-none focus:dc-border-opacity-20 dc-resize-none"
              disabled={loading}
              maxLength={500}
            />
            <div className="dc-text-right dc-text-xs dc-text-[#777777] dc-mt-4">
              {reason.length}/500
            </div>
          </div>

          {error && (
            <div className="dc-mb-16 dc-p-12 dc-bg-red-500 dc-bg-opacity-20 dc-border dc-border-red-500 dc-border-opacity-30 dc-rounded-lg">
              <p className="dc-text-red-400 dc-text-sm">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="dc-flex dc-gap-12">
            <button
              type="button"
              onClick={onClose}
              className="dc-flex-1 dc-py-12 dc-px-16 dc-border dc-border-white dc-border-opacity-20 dc-text-white dc-rounded-lg hover:dc-border-opacity-40 dc-transition-all dc-duration-300"
              disabled={loading}
            >
              {t('post.reportCancel')}
            </button>
            <button
              type="submit"
              className="dc-flex-1 dc-py-12 dc-px-16 dc-bg-gradient-to-r dc-from-[#4E2AFC] dc-to-[#6222FD] dc-text-white dc-rounded-lg hover:dc-from-[#5A30FF] hover:dc-to-[#7028FF] dc-transition-all dc-duration-300 disabled:dc-opacity-50 disabled:dc-cursor-not-allowed"
              disabled={loading || !reason.trim()}
            >
              {loading ? '처리중...' : t('post.reportSubmit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}