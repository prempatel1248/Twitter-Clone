import { useContext, useEffect, useState } from "react";
import type { PostInterface } from "../models/PostInterface"
import { useParams } from "react-router-dom";
import { getUser } from "../utils/Functions";
import { PostContext, PostDispatchContext } from "../context/PostContext";
import { UserContext, UserDispatchContext } from "../context/UserContext";

const ProfilePost = (post:PostInterface) => {

    const posts = useContext(PostContext);
    const postdispatch = useContext(PostDispatchContext);
    const users = useContext(UserContext);
    const dispatch = useContext(UserDispatchContext);

    const username = useParams().username
    
    const [uname, setUname] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [content, setContent] = useState('');
    
    const usertext = localStorage.getItem('currentUser') || '';
    const currentUser = JSON.parse(usertext);
    const user = getUser(users, currentUser);
    const lightTheme = getUser(users, currentUser).lightTheme

    const [reply, setreply] = useState(false);
    
    useEffect(()=>{
        posts.map((eachPost)=>{
            if(eachPost.id===post.repost){
                setUname(eachPost.username);
                setFname(eachPost.firstname);
                setLname(eachPost.lastname);
                setContent(eachPost.content);
            }
        });
    },[]);

    function deletePost(){
        const postId = post.id;
        postdispatch({type:'deletePost', postId});
        dispatch({type:'deletePost', postId});
    }

    const [editInp, setEditInp] = useState(post.content);
    const [edit, setEdit] = useState(false);
    function handleConfirmEdit(){
        setEdit(false);
        setEditInp(post.content);
        const postId = post.id;
        postdispatch({type: 'editPost', postId, newContent:editInp});
    }

    function handleCancelEdit(){
        setEdit(false);
        setEditInp(post.content);
    }

    function countRepost(){
        let count = 0;
        posts.map((p)=>{
            if(p.repost===post.id){
                count+=1;
            }
        })
        return count
    }

    function hasReposted(){
        let reposted = false;
        posts.map((firstPost)=>{
            if(post.id===firstPost.repost && firstPost.username===currentUser){
                reposted=true;
            }
        });
        return reposted
    }

    function repost(){
        let reposted = false;
        if(post.username===currentUser){
            return;
        }
        posts.map((firstPost)=>{
            if(post.id===firstPost.repost && firstPost.username===currentUser){
                reposted=true;
            }
        });
        if(reposted){
            return;
        }
        let postId = post.id
        if(post.repost!==""){
            postId = post.repost;
            postdispatch({type:'repost', username:currentUser, postId, firstname:user.firstname, lastname:user.lastname});    
        }
        postdispatch({type:'repost', username:currentUser, postId, firstname:user.firstname, lastname:user.lastname});
    }

    function hasLiked(){
        let liked = false;
        user.likes.map((like)=>{
            if(like===post.id){
                liked=true;
            }
        })
        return liked
    }

    function likePost(){
        const postId = post.id;
        postdispatch({type: 'likePost', username:currentUser, postId});
        dispatch({type:'likePost', username:currentUser, postId});
    }

    function dislikePost(){
        const postId = post.id;
        postdispatch({type: 'dislikePost', username:currentUser, postId});
        dispatch({type:'dislikePost', username:currentUser, postId});
    }

    return (
        <div className={`m-[30px] p-[30px] pb-[40px] ${lightTheme ? 'bg-neutral-200' : 'bg-neutral-900'}`}>
            {post.repost==="" ? 
                <div>
                    <div className={`p-[5px] ${lightTheme ? 'bg-white' : 'bg-neutral-900'}`}>{post.content}</div>
                    <div className="flex justify-between items-center my-[10px]">
                        <div className="flex items-center">
                        <div className="w-[50px]">{!hasLiked() && <i className={`fa fa-heart-o hover:text-red-500 ${user.lightTheme ? 'light' : 'dark'}`} onClick={likePost} />}
                        {hasLiked() && <i className="fa fa-heart" onClick={dislikePost} />}{post.likes.length!==0 && <span className="ml-[4px]">{post.likes.length}</span>}</div>
                            <div className="w-[50px]"><i className={`fa fa-retweet ${hasReposted() ? 'fa-retweet-red' : user.lightTheme ? 'light' : 'dark'}`} onClick={repost} />{countRepost()!==0 && <span className="ml-[4px]">{countRepost()}</span>}</div>
                            <div className="w-[50px]">
                                <i className={`fa fa-comment-o ${reply ? 'fa-comment-blue' : lightTheme ? 'light' : 'dark'}`} onClick={()=>setreply(!reply)} />
                            </div>
                        </div>
                        {post.editedAt==='' && <div className="ml-auto">{post.date}</div>}
                    </div>
                </div> : 
                <div>
                    <div className="border">
                        {uname==='' ? <div className={`p-[5px] text-sm italic ${user.lightTheme ? 'bg-white' : 'bg-neutral-900'}`}>This content is no longer available</div> :
                        <div>
                            <div className="flex items-center">
                                <span>
                                    <i className="fa fa-user-circle" />
                                </span>
                                <div>
                                    <div>@{uname}</div>
                                    <div className="font-semibold">{fname} {lname}</div>
                                </div>
                            </div>
                            <div className={`p-[5px] ${lightTheme ? 'bg-white' : 'bg-neutral-900'}`}>{content}</div>
                        </div>}
                    </div>
                    <div className="flex justify-between items-center my-[10px]">
                        <div className="flex items-center">
                            <div className="w-[50px]"><i className={`fa fa-heart-o ${lightTheme ? 'light' : 'dark'}`} />{post.likes.length!==0 && `${post.likes.length}`}</div>
                            <div className="w-[50px]"><i className={`fa fa-retweet ${lightTheme ? 'light' : 'dark'}`} />{countRepost()!==0 && <span className="ml-[4px]">{countRepost()}</span>}</div>
                            <div className="w-[50px]">
                                <i className={`fa fa-comment-o ${reply ? 'fa-comment-blue' : lightTheme ? 'light' : 'dark'}`} onClick={()=>setreply(!reply)} />
                            </div>
                        </div>
                        {post.editedAt==='' && <div className="ml-auto">{post.date}</div>}
                    </div>
                </div> }
                {post.editedAt!=='' && <div className="text-right w-[100%]">{`Edited ${post.editedAt}`}</div>}
                {reply && <div className="mb-[20px]">
                    {post.reply.map((rep)=>(
                        <div key={rep.username}>
                            <div className="font-bold">@{rep.username}</div>
                            <div className="flex justify-between">
                                <div className="w-9/10 text-wrap">{rep.content}</div>
                            </div>
                        </div>
                    ))}
                    </div>
                }
                <div className="float-right">
                    {currentUser===username && post.repost==='' && <button className="h-[30px] w-[70px] mr-[20px] bg-blue-500 hover:cursor-pointer" onClick={()=>setEdit(!edit)}>Edit</button>}
                    {currentUser===username && <button className="h-[30px] w-[70px] bg-red-500 hover:cursor-pointer" onClick={deletePost}>Delete</button>}
                </div>
                {edit && <div>
                    <textarea className="h-[150px] border w-[100%] mt-[10px]" value={editInp} onChange={e=>setEditInp(e.target.value)} placeholder="Edit..." />
                    <div className="float-right mt-[5px]">
                        <button className="h-[30px] w-[70px] mr-[20px] bg-blue-500 hover:cursor-pointer" onClick={handleConfirmEdit}>Confirm</button>
                        <button className="h-[30px] w-[70px] bg-red-500 hover:cursor-pointer" onClick={handleCancelEdit}>Cancel</button>
                    </div>
                </div>}
        </div>
    )
}

export default ProfilePost
