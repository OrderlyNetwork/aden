// MongoDB Extended JSON 형식과 일반 JSON 형식 간의 변환을 처리하는 유틸리티

import { Post } from '~/api/post';

// 백엔드 응답을 프론트엔드 Post 타입으로 변환
export function transformBackendPost(backendPost: any): Post {
  return {
    _id: {
      $oid: typeof backendPost._id === 'string' ? backendPost._id : backendPost._id?.$oid || ''
    },
    version: backendPost.version || '',
    title: backendPost.title || '',
    board_type: backendPost.board_type || '',
    category: backendPost.category,
    content: backendPost.content || '',
    author_id: backendPost.author_id,
    author_name: backendPost.author_name || '',
    author_object: backendPost.author_object,
    views: backendPost.views || 0,
    likes: backendPost.likes || 0,
    comments: backendPost.comments || 0,
    is_important: backendPost.is_important || false,
    is_best: backendPost.is_best,
    is_active: backendPost.is_active,
    post_comments_array: backendPost.post_comments_array,
    created_at: backendPost.created_at?.$date ? backendPost.created_at : {
      $date: {
        $numberLong: new Date(backendPost.created_at).getTime().toString()
      }
    }
  };
}

// 백엔드 응답 배열을 변환
export function transformBackendPosts(backendPosts: any[]): Post[] {
  return backendPosts.map(transformBackendPost);
}