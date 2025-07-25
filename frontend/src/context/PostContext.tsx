import { createContext, useEffect, useReducer, type ReactNode } from "react";
import type { PostInterface } from "../models/PostInterface";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export const PostContext = createContext<PostInterface[]>([]);
export const PostDispatchContext = createContext<any>(null);

export const PostContextProvider = ({ children }: { children: ReactNode }) => {

  const initialPoststext = localStorage.getItem('posts') || '[]';
  const initialPosts = JSON.parse(initialPoststext);
  const [posts, postdispatch] = useReducer(postsreducer, initialPosts);
  console.log("posts:", posts);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await axios.get("http://localhost:3001/api/posts");
        postdispatch({ type: 'init', payload: response.data });
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts));
    axios.put("http://localhost:3001/api/posts", posts)
      .catch(err => console.error("Error saving posts:", err));
  }, [posts]);

  return (
    <PostContext.Provider value={posts}>
      <PostDispatchContext.Provider value={postdispatch}>
        {children}
      </PostDispatchContext.Provider>
    </PostContext.Provider>
  )
}

function postsreducer(posts: PostInterface[], action: any) {
  switch (action.type) {
    case 'init':
      return action.payload;

    case 'addNewPost': {
      const newPost: PostInterface = {
        id: uuidv4(),
        username: action.username,
        firstname: action.firstname,
        lastname: action.lastname,
        content: action.content,
        repost: action.repost,
        reply: [],
        likes: [],
        date: new Date().toLocaleString('en-GB'),
        editedAt: ''
      }
      return [...posts, newPost]
    }
    case 'likePost': {
      const updatedPost = posts.map((post) => {
        if (post.id === action.postId) {
          return { ...post, likes: [...post.likes, action.username] }
        }
        return post
      })
      return updatedPost;
    }
    case 'dislikePost': {
      const updatedPost = posts.map((post) => {
        if (post.id === action.postId) {
          const updatedLikes = post.likes.filter(username => username !== action.username);
          return { ...post, likes: updatedLikes }
        }
        return post
      });
      return updatedPost;
    }
    case 'repost': {
      const newPost: PostInterface = {
        id: uuidv4(),
        username: action.username,
        firstname: action.firstname,
        lastname: action.lastname,
        content: "",
        repost: action.postId,
        reply: [],
        likes: [],
        date: new Date().toLocaleString('en-GB'),
        editedAt: ''
      }
      return [...posts, newPost]
    }
    case 'deletePost': {
      return posts.filter(post => post.id !== action.postId);
    }
    case 'addreply': {
      const updatedPost = posts.map((post) => {
        if (post.id === action.postId) {
          return { ...post, reply: [...post.reply, { username: action.username, content: action.reply }] }
        }
        return post
      });
      return updatedPost
    }
    case 'deletereply': {
      const updatedPost = posts.map((post) => {
        if (post.id === action.postId) {
          return { ...post, reply: post.reply.filter(rep => rep.username !== action.username) }
        }
        return post
      });
      return updatedPost
    }
    case 'editPost': {
      const editDate = new Date().toLocaleString('en-GB')
      const updatedPost = posts.map((post) => {
        if (post.id === action.postId) {
          return { ...post, editedAt: editDate, content: action.newContent }
        }
        return post;
      });
      return updatedPost;
    }
    case 'deleteAccount': {
      const updatedPost = posts.filter(post => post.username !== action.username);
      return updatedPost;
    }

    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
