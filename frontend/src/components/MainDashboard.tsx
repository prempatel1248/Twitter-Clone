import { useContext, useEffect, useState } from "react";
import Post from "./Post";
import { useParams } from "react-router-dom";
import { getUser } from "../utils/Functions";
import { UserContext } from "../context/UserContext";
import { PostContext } from "../context/PostContext";

const MainDashboard = () => {

    const users = useContext(UserContext);
    const posts = useContext(PostContext);

    const username = useParams().username || '';
    const user = getUser(users, username);

    const [search, setSearch] = useState('');
    const [updatedPost, setUpdatedPost] = useState(posts);

    useEffect(()=>{
        const updatedlist = posts.filter(post=>post.username.includes(search) || post.firstname.includes(search) || post.lastname.includes(search) || post.content.includes(search))
        setUpdatedPost(updatedlist);
    },[search]);

    useEffect(()=>{
        setUpdatedPost(posts);
    },[posts])

    function isFollowing(postUser: string){
        let userIsFollowing = false;
        user.following.map((following)=>{
            if(following===postUser){
                userIsFollowing = true;
            }
        })
        return userIsFollowing;
    }

    return (
        <>
            <div className={`${user.lightTheme ? 'bg-neutral-300' : 'bg-neutral-800'} bg-opacity-10 navbar h-[100px] bg-neutral-200 flex items-center justify-between p-7`}>
                <input className="h-[40px] w-1/2 rounded-xl py-0 px-5 text-xl border-none bg-white text-black" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search" />
            </div>
            {updatedPost.map((post)=>(
                <div key={`${post.id}`}>
                    {(getUser(users, post.username).public || isFollowing(post.username)) && username!==post.username &&
                    <Post id={post.id} username={post.username} firstname={post.firstname} lastname={post.lastname} content={post.content} repost={post.repost} reply={post.reply} likes={post.likes} date={post.date} editedAt={post.editedAt} />
                    }
                </div>
            ))}
        </>
    )
}

export default MainDashboard;