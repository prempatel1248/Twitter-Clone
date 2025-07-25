import { useNavigate, useParams } from "react-router-dom";
import type { PostInterface } from "../models/PostInterface";
import { getUser } from "../utils/Functions";
import { useContext, useEffect, useState } from "react";
import { UserContext, UserDispatchContext } from "../context/UserContext";
import { PostContext, PostDispatchContext } from "../context/PostContext";

const Post = (post:PostInterface) => {

    const users = useContext(UserContext);
    const dispatch = useContext(UserDispatchContext);
    const posts = useContext(PostContext);
    const postdispatch = useContext(PostDispatchContext);

    const userUsername = useParams().username || '';
    const user = getUser(users, userUsername);

    const navigate = useNavigate();

    function isFollowing(){
        let userIsFollowing = false;
        user.following.map((userFollowing)=>{
            if(userFollowing===post.username){
                userIsFollowing = true;
            }
        })
        return userIsFollowing;
    }

    function requestToFollow(){
        let userHasReq = false;
        user.followRequestOut.map((req)=>{
            if(req===post.username){
                userHasReq = true;
            }
        })
        return userHasReq;
    }

    function handleFollow(username1:string, username2:string){
        if(username1===username2){
            return;
        }
        if(user.public){
            dispatch({type: 'follow', username1:username1, username2:username2})
        }
        if(!user.public){
            dispatch({type: 'followRequest', username1:username1, username2:username2})
        }
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
        postdispatch({type: 'likePost', username:userUsername, postId});
        dispatch({type:'likePost', username:userUsername, postId});
    }

    function dislikePost(){
        const postId = post.id;
        postdispatch({type: 'dislikePost', username:userUsername, postId});
        dispatch({type:'dislikePost', username:userUsername, postId});
    }

    function repost(){
        let reposted = false;
        if(post.username===userUsername){
            return;
        }
        posts.map((firstPost)=>{
            if(post.id===firstPost.repost && firstPost.username===userUsername){
                reposted=true;
            }
        });
        if(reposted){
            return;
        }
        let postId = post.id
        if(post.repost!==""){
            postId = post.repost;
            postdispatch({type:'repost', username:userUsername, postId, firstname:user.firstname, lastname:user.lastname});
            return;
        }
        postdispatch({type:'repost', username:userUsername, postId, firstname:user.firstname, lastname:user.lastname});
    }

    function hasReposted(){
        let reposted = false;
        posts.map((firstPost)=>{
            if(post.id===firstPost.repost && firstPost.username===userUsername){
                reposted=true;
            }
        });
        return reposted
    }

    const [uname, setUname] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [content, setContent] = useState('');
    
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

    const [reply, setreply] = useState(false);
    const [replytext, setReplytext] = useState('');

    function addreply(){
        setReplytext('');
        let alreadyReplied = false;
        post.reply.map((eachreply)=>{
            if(eachreply.username===userUsername){
                alreadyReplied=true;
            }
        })
        if(alreadyReplied){
            return;
        }
        const postId = post.id;
        postdispatch({type: 'addreply', postId, username:userUsername, reply:replytext})
    }

    function deletereply(){
        const postId = post.id;
        postdispatch({type: 'deletereply', postId, username:userUsername});
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
    
    return (
        <div className={`post-container rounded-2xl m-[15px] p-[10px] ${user.lightTheme ? 'bg-neutral-200' : 'bg-neutral-900 text-white'}`}>
            <div className="flex items-center">
                <span>
                    <i className="fa fa-user-circle" onClick={()=>navigate(`/${post.username}/profile`)} />
                </span>
                <div className="m-[5px]">
                    <div className="cursor-pointer hover:text-red-500" onClick={()=>navigate(`/${post.username}/profile`)}>@{post.username}</div>
                    <div>
                        <div className="text-2xl font-bold">{post.firstname} {post.lastname}</div>
                    </div>
                </div>
                {!isFollowing() && !requestToFollow() && post.username!==userUsername && <button className="bg-blue-500 hover:bg-blue-400 rounded-xs cursor-pointer h-[40px] w-[100px] ml-auto" onClick={()=>handleFollow(post.username, userUsername)}>Follow</button>}
                {isFollowing() && post.username!==userUsername && <div className="ml-auto">Following</div>}
                {requestToFollow() && post.username!==userUsername && <div className="ml-auto">Requested</div>}
            </div>
            <div className="">
                {post.repost==="" ? <div className={`p-[5px] ${user.lightTheme ? 'bg-white' : 'bg-neutral-900'}`}>{post.content}</div> : 
                
                <div className={`border rounded-2xl p-[5px] ${user.lightTheme ? 'bg-neutral-200' : 'bg-neutral-900'}`}>
                    {uname==='' ? <div className={`p-[5px] text-sm italic ${user.lightTheme ? 'bg-white' : 'bg-neutral-900'}`}>This content is no longer available</div> : 
                    <div>
                        <div className="flex items-center">
                            <span>
                                <i className="fa fa-user-circle fa-user-circle-repost" />
                            </span>
                            <div>
                                <div className="text-xs">@{uname}</div>
                                <div>
                                    <div className="font-bold">{fname} {lname}</div>
                                </div>
                            </div>
                        </div>
                        <div className={`p-[5px] ${user.lightTheme ? 'bg-white' : 'bg-neutral-900/80'}`}>{content}</div>
                    </div>}
                </div>}
            </div>
            <div>
                <span className="flex items-center mt-[10px]">
                    <div className="w-[50px]">{!hasLiked() && <i className={`fa fa-heart-o hover:text-red-500 ${user.lightTheme ? 'light' : 'dark'}`} onClick={likePost} />}
                    {hasLiked() && <i className="fa fa-heart" onClick={dislikePost} />}{post.likes.length!==0 && <span className="ml-[4px]">{post.likes.length}</span>}</div>
                    <div className="w-[50px]"><i className={`fa fa-retweet ${hasReposted() ? 'fa-retweet-red' : user.lightTheme ? 'light' : 'dark'}`} onClick={repost} />{countRepost()!==0 && <span className="ml-[4px]">{countRepost()}</span>}</div>
                    <div className="w-[50px]">
                        <i className={`fa fa-comment-o ${reply ? 'fa-comment-blue' : user.lightTheme ? 'light' : 'dark'}`} onClick={()=>setreply(!reply)} />
                    </div>
                    {post.editedAt==='' && <div className="ml-auto">{post.date}</div>}
                </span>
                {post.editedAt!=='' && <div className="text-right w-[100%]">{`Edited ${post.editedAt}`}</div>}
                {reply && <div>
                    {post.reply.map((rep)=>(
                        <div key={rep.username}>
                            <div className="font-bold">@{rep.username}</div>
                            <div className="flex justify-between">
                                <div className="w-9/10 text-wrap">{rep.content}</div>
                                {rep.username===userUsername && <button className="h-[30px] w-[70px] bg-red-500 hover:cursor-pointer" onClick={deletereply}>delete</button>}
                            </div>
                        </div>
                    ))}
                    <input className="w-9/10 p-[6px] h-fit border mt-[10px]" value={replytext} onChange={e=>setReplytext(e.target.value)} placeholder="Reply" />
                    <span>
                        <i className="fa fa-send" onClick={addreply} />
                    </span>
                    </div>
                }
            </div>

        </div>
    )
}

export default Post;
