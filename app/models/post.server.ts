export type Author = {
  id: string;
  username: string;
  avatar: string;
};

export type Comment = {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  author: Author;
  createdAt: string;
  views: number;
  likes: number;
  comments: Comment[];
};

// 임시 데이터 저장소 (실제로는 데이터베이스를 사용해야 함)
let posts: Post[] = [
  {
    id: "1",
    title: "첫 번째 게시글",
    content: "이것은 첫 번째 게시글입니다.",
    author: {
      id: "1",
      username: "홍길동",
      avatar: "https://example.com/avatar1.jpg",
    },
    createdAt: "2023-01-01",
    views: 0,
    likes: 0,
    comments: [],
  },
  {
    id: "2",
    title: "두 번째 게시글",
    content: "이것은 두 번째 게시글입니다.",
    author: {
      id: "2",
      username: "김철수",
      avatar: "https://example.com/avatar2.jpg",
    },
    createdAt: "2023-01-02",
    views: 0,
    likes: 0,
    comments: [],
  },
];

export async function getPosts() {
  return [...posts];
}

export async function getPost(id: string) {
  return posts.find((post) => post.id === id);
}

export async function createPost(post: Omit<Post, "id" | "createdAt">) {
  const newPost: Post = {
    ...post,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split('T')[0],
    views: 0,
    likes: 0,
    comments: [],
  };
  posts.unshift(newPost);
  return newPost;
}

export async function updatePost(id: string, updatedPost: Partial<Omit<Post, "id" | "createdAt">>) {
  const index = posts.findIndex((post) => post.id === id);
  if (index !== -1) {
    posts[index] = { ...posts[index], ...updatedPost };
    return posts[index];
  }
  return null;
}

export async function deletePost(id: string) {
  const index = posts.findIndex((post) => post.id === id);
  if (index !== -1) {
    const deletedPost = posts[index];
    posts = posts.filter((post) => post.id !== id);
    return deletedPost;
  }
  return null;
} 