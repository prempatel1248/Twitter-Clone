import { useContext } from "react";
import ProfilePost from "../components/ProfilePost";
import { useNavigate, useParams } from "react-router-dom";
import { getUser } from "../utils/Functions";
import RightSideBar from "../components/RightSideBar";
import LeftSideBar from "../components/LeftSideBar";
import { UserContext, UserDispatchContext } from "../context/UserContext";
import { PostContext } from "../context/PostContext";

const Profile = () => {

    const users = useContext(UserContext);
    const dispatch = useContext(UserDispatchContext);
    const posts = useContext(PostContext);

    const username = useParams().username || '';
    const user = getUser(users,username);

    const usertext = localStorage.getItem('currentUser') || '';
    const currentUser = JSON.parse(usertext);

    const navigate = useNavigate();

    function isFollowing(){
        let userIsFollowing = false;
        user.followers.map((follower)=>{
            if(follower===currentUser){
                userIsFollowing = true;
            }
        })
        return userIsFollowing;
    }

    function requestToFollow(){
        let userHasReq = false;
        user.followRequestIn.map((req)=>{
            if(req===currentUser){
                userHasReq = true;
            }
        })
        return userHasReq;
    }

    function handleFollow(username1:string, username2:string){
        if(username1===username2){
            return;
        }
        dispatch({type: 'follow', username1:username1, username2:username2})
    }

    function handleUnfollow(username1:string, username2:string){
        if(username1===username2){
            return;
        }
        dispatch({type: 'unfollow', username1, username2})
    }

    function handleFollowRequest(username1:string, username2:string){
        if(username1===username2){
            return;
        }
        dispatch({type: 'followRequest', username1, username2})
    }

    function handleCancelRequest(username1:string, username2:string){
        if(username1===username2){
            return;
        }
        dispatch({type: 'cancelFollowRequest', username1, username2})
    }

    function handleFollowClick(){
        if(isFollowing()){
            handleUnfollow(username, currentUser);
        }
        else{
            if(user.public){
                handleFollow(username, currentUser);
            }
            else{
                handleFollowRequest(username, currentUser);
            }
        }
    }

    function countPosts(){
        return posts.filter(post=>post.username===username).length
    }

    function handleMessgeBtn(){
        navigate(`/${currentUser}/message/${username}`);
    }

    return (
        <div className="profile h-screen flex flex-row">
            <div className={`leftsidebar w-15/100  flex flex-col items-center fixed h-1/1 ${getUser(users, currentUser).lightTheme ? 'bg-neutral-200' : 'bg-neutral-800 text-white'}`}>
                <LeftSideBar />
            </div>
            <div className={`middlebar w-65/100 ml-[15%] overflow-y-scroll mr-[20%] ${getUser(users, currentUser).lightTheme ? '' : 'bg-black text-white'}`}>
                <div className="flex items-center m-[50px]">
                    <span>
                        <i className="fa fa-user-circle fa-user-circle-profile" />
                    </span>
                    <div className="ml-[20px]">
                        <div className="my-[10px] text-3xl">@{username}</div>
                        <div className="text-5xl my-[10px] font-bold">{user.firstname} {user.lastname}</div>
                    </div>
                    <div className="ml-auto flex">
                        {(user.dmFromAnyone || isFollowing()) && username!==currentUser && <button className={`${getUser(users,currentUser).lightTheme ? 'bg-neutral-300 hover:bg-neutral-200' : 'bg-neutral-900 hover:bg-neutral-800'} rounded-xs cursor-pointer h-[50px] w-[150px] text-xl mr-[20px]`} onClick={handleMessgeBtn}>Message</button>}
                        {requestToFollow() && 
                            <div className="h-[50px] w-[150px] text-xl ml-auto mr-[30px] flex items-center">
                                <div>Requested</div>
                                <button className="bg-red-500 hover:bg-red-400 rounded-xs cursor-pointer h-[40px] px-[10px] ml-[20px]" onClick={()=>handleCancelRequest(username, currentUser)}>Cancel</button>
                            </div>
                        }
                        {!requestToFollow() && currentUser!==username && <button className="bg-blue-500 hover:bg-blue-400 rounded-xs cursor-pointer h-[50px] w-[150px] text-xl ml-auto" onClick={handleFollowClick}>{isFollowing() ? 'Unfollow' : 'Follow'}</button>}
                    </div>
                </div>
                <div className="flex justify-evenly m-[20px] text-2xl mb-[50px]">
                    <div className="text-center">
                        <div>{countPosts()}</div>
                        <div>Posts</div>
                    </div>
                    <div className="text-center">
                        <div>{user.followers.length}</div>
                        <div>Followers</div>
                    </div>
                    <div className="text-center">
                        <div>{user.following.length}</div>
                        <div>Following</div>
                    </div>
                </div>
                <hr></hr>
                {(user.public || isFollowing() || username===currentUser) ? 
                <div>
                    {posts.map((post)=>(
                        <div key={`${post.id}`}>
                            {username===post.username && <ProfilePost id={post.id} username={post.username} firstname={post.firstname} lastname={post.lastname} content={post.content} repost={post.repost} reply={post.reply} likes={post.likes} date={post.date} editedAt={post.editedAt} />}
                        </div>
                    ))}
                </div> :
                <div className="text-2xl w-[100%] text-center mt-[50px]">This account is private!</div>
                }
            </div>
            <div className={`rightsidebar w-20/100 fixed right-0 h-1/1 overscroll-y-scroll ${getUser(users, currentUser).lightTheme ? 'bg-neutral-200' : 'bg-neutral-800 text-white'}`}>
                <RightSideBar />
            </div>
        </div>
    )
}

export default Profile;