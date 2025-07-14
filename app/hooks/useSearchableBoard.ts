import { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams, useNavigate } from '@remix-run/react';
import { Post } from '~/api/post';
import { BoardContextType } from '~/layouts/BoardLayout';

interface UseSearchableBoardProps {
  boardType: string;
  fetchPosts: (page: number) => Promise<void>;
  postsPerPage: number;
}

interface UseSearchableBoardReturn {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  setTotalPages: (pages: number) => void;
  isSearching: boolean;
  searchQuery: string | null;
  handlePageChange: (page: number) => void;
}

export function useSearchableBoard({
  boardType,
  fetchPosts,
  postsPerPage
}: UseSearchableBoardProps): UseSearchableBoardReturn {
  const context = useOutletContext<BoardContextType>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // 검색 결과가 있으면 검색 결과를 표시, 없으면 일반 게시글 표시
  useEffect(() => {
    console.log(`[${boardType}] Context searchResults:`, context?.searchResults);
    console.log(`[${boardType}] Search param:`, searchParams.get('search'));
    console.log(`[${boardType}] Page param:`, searchParams.get('page'));
    
    if (context?.searchResults && searchParams.get('search')) {
      // 검색 결과가 있을 때
      console.log(`[${boardType}] Setting search results posts:`, context.searchResults.data?.posts);
      console.log(`[${boardType}] Pagination info:`, context.searchResults.data?.pagination);
      setPosts(context.searchResults.data?.posts || []);
      setTotalPages(context.searchResults.data?.pagination?.total_pages || 1);
      // URL의 page 파라미터를 우선 사용
      const pageFromUrl = parseInt(searchParams.get('page') || '1');
      setCurrentPage(pageFromUrl);
    } else if (!searchParams.get('search')) {
      // 검색어가 없을 때만 일반 게시글 목록을 가져옴
      fetchPosts(currentPage);
    }
  }, [context?.searchResults, searchParams.get('search'), searchParams.get('page'), boardType]);
  
  // currentPage 변경 시 처리
  useEffect(() => {
    if (!searchParams.get('search')) {
      // 검색 모드가 아닐 때만 페이지 변경에 따라 데이터 가져오기
      fetchPosts(currentPage);
    }
  }, [currentPage]);
  
  const handlePageChange = (page: number) => {
    if (searchParams.get('search')) {
      // 검색 모드에서는 URL 파라미터를 업데이트
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('page', page.toString());
      setSearchParams(newSearchParams);
    } else {
      // 일반 모드에서는 기존 방식대로
      setCurrentPage(page);
    }
  };
  
  return {
    posts,
    setPosts,
    currentPage,
    setCurrentPage,
    totalPages,
    setTotalPages,
    isSearching: context?.isSearching || false,
    searchQuery: searchParams.get('search'),
    handlePageChange
  };
}