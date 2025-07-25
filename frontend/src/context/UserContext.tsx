import { createContext, useEffect, useReducer, type ReactNode } from "react";
import type { UserInterface } from "../models/UserInterface";
import axios from "axios";

export const UserContext = createContext<UserInterface[]>([]);
export const UserDispatchContext = createContext<any>(null);

export const UserContextProvider = ({ children }: { children: ReactNode }) => {

  const intitalUserstext = localStorage.getItem('users') || '[]';
  const initialUsers = JSON.parse(intitalUserstext);
  const [users, dispatch] = useReducer(usersreducer, initialUsers as UserInterface[]);
  console.log("users:", users);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:3001/api/users');
        dispatch({ type: 'init', payload: response.data });
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    }
    fetchData();
  }, []);


  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
    axios.put("http://localhost:3001/api/users", users)
      .catch(err => console.error("Failed to update users:", err));

  }, [users]);

  return (
    <UserContext.Provider value={users}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  )
}

function usersreducer(users: UserInterface[], action: any) {
  switch (action.type) {
    case 'init': {
      return action.payload;
    }
    case 'addUser': {
      const newUser: UserInterface = {
        username: action.username,
        password: action.password,
        firstname: action.firstname,
        lastname: action.lastname,
        following: [],
        followers: [],
        likes: [],
        lightTheme: false,
        public: true,
        followRequestIn: [],
        followRequestOut: [],
        notification: [],
        dmFromAnyone: true,
        chats: []
      }
      const updatedUsers = [...users, newUser];
      return updatedUsers;
    }
    case 'changeTheme': {
      const updatedList = users.map((user) => {
        if (user.username == action.username) {
          return { ...user, lightTheme: !user.lightTheme }
        }
        return user
      });
      return updatedList;
    }
    case 'followRequest': {
      const updatedList = users.map((user) => {
        if (user.username === action.username1) {
          return { ...user, followRequestIn: [...user.followRequestIn, action.username2] }
        }
        if (user.username === action.username2) {
          return { ...user, followRequestOut: [...user.followRequestOut, action.username1] }
        }
        return user;
      });
      return updatedList
    }
    case 'cancelFollowRequest': {
      const updatedList = users.map((user) => {
        if (user.username === action.username1) {
          const updatedRequest = user.followRequestIn.filter(request => request !== action.username2);
          return { ...user, followRequestIn: updatedRequest }
        }
        if (user.username === action.username2) {
          const updatedRequest = user.followRequestOut.filter(request => request !== action.username1);
          return { ...user, followRequestOut: updatedRequest }
        }
        return user;
      });
      return updatedList;
    }
    case 'allowFollowPrivate': {
      const updatedList = users.map((user) => {
        if (user.username === action.username1) {
          const updatedRequest = user.followRequestIn.filter(request => request !== action.username2);
          return { ...user, followers: [...user.followers, action.username2], followRequestIn: updatedRequest }
        }
        if (user.username === action.username2) {
          const updatedRequest = user.followRequestOut.filter(request => request !== action.username1);
          return { ...user, following: [...user.following, action.username1], followRequestOut: updatedRequest }
        }
        return user;
      });
      return updatedList;
    }
    case 'follow': {
      const updatedList = users.map((user) => {
        if (user.username === action.username1) {
          return { ...user, followers: [...user.followers, action.username2] }
        }
        if (user.username === action.username2) {
          return { ...user, following: [...user.following, action.username1] }
        }
        return user;
      });
      return updatedList;
    }
    case 'unfollow': {
      const updatedList = users.map((user) => {
        if (user.username === action.username1) {
          const updatedfollowers = user.followers.filter(follower => follower !== action.username2);
          return { ...user, followers: updatedfollowers }
        }
        if (user.username === action.username2) {
          const updatedFollowing = user.following.filter(Userfollowing => Userfollowing !== action.username1);
          return { ...user, following: updatedFollowing }
        }
        return user;
      });
      return updatedList;
    }
    case 'likePost': {
      const updatedList = users.map((user) => {
        if (user.username === action.username) {
          return { ...user, likes: [...user.likes, action.postId] }
        }
        return user;
      });
      return updatedList;
    }
    case 'dislikePost': {
      const updatedList = users.map((user) => {
        if (user.username === action.username) {
          const updatedLikes = user.likes.filter(postId => postId !== action.postId);
          return { ...user, likes: updatedLikes }
        }
        return user
      });
      return updatedList;
    }
    case 'deletePost': {
      const updatedList = users.map((user) => {
        return { ...user, likes: user.likes.filter(eachLike => eachLike !== action.postId) }
      })
      return updatedList;
    }
    case 'changeThemeFromSetting': {
      const updatedList = users.map((user) => {
        if (user.username == action.username) {
          return { ...user, lightTheme: action.lightTheme }
        }
        return user
      });
      return updatedList;
    }
    case 'changePublicPrivate': {
      const updatedList = users.map((user) => {
        if (user.username == action.username) {
          return { ...user, public: action.publicAccount }
        }
        return user
      });
      return updatedList;
    }
    case 'changeDmSetting': {
      const updatedList = users.map((user) => {
        if (user.username === action.username) {
          return { ...user, dmFromAnyone: action.DmFromAnyone }
        }
        return user;
      });
      return updatedList;
    }
    case 'saveMessage': {
      const updatedList = users.map((user) => {
        if (user.username === action.username) {
          let isUserChatPresent = false
          let updatedChat = user.chats.map((chat) => {
            if (chat.username === action.username2) {
              isUserChatPresent = true
              return action.chatState;
            }
            return chat
          });
          if (!isUserChatPresent) {
            updatedChat = [...user.chats, action.chatState];
          }

          return { ...user, chats: updatedChat }
        }
        return user;
      });
      return updatedList
    }
    case 'editMsg': {
      const updatedMsg = action.updatedMsg;
      const updatedList = users.map((user) => {
        if (user.username === updatedMsg.who) {
          const updUser = user.chats.map((eachChat) => {
            if (eachChat.username === action.msgWith) {
              const updChat = eachChat.chat.map((c) => {
                if (c.chatId === updatedMsg.chatId) {
                  return updatedMsg
                }
                return c
              });
              return { ...eachChat, chat: updChat }
            }
            return eachChat
          });
          return { ...user, chats: updUser }
        }
        return user
      });
      return updatedList
    }
    case 'deleteAccount': {
      const newList = users.filter(user => user.username !== action.username);
      const updatedList = newList.map((user) => {
        const updatedFollowers = user.followers.filter(foll => foll !== action.username);
        const updatedFollowing = user.following.filter(foll => foll !== action.username);
        const updatedreqin = user.followRequestIn.filter(req => req !== action.username);
        const updatedreqout = user.followRequestOut.filter(req => req !== action.username);
        const updatedChat = user.chats.filter(chat => chat.username !== action.username);
        return { ...user, followers: updatedFollowers, following: updatedFollowing, followRequestIn: updatedreqin, followRequestOut: updatedreqout, chats: updatedChat }
      });
      console.log(updatedList);
      return updatedList;
    }

    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}