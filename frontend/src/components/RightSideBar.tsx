import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/Functions";
import { UserContext, UserDispatchContext } from "../context/UserContext";

const RightSideBar = () => {

    const users = useContext(UserContext);
    const dispatch = useContext(UserDispatchContext);

    const usertext = localStorage.getItem('currentUser') || '';
    const username = JSON.parse(usertext);
    const user = getUser(users, username);
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [updatedUsers, setUpdatedUsers] = useState(users);
    const [updatedFollowings, setUpdatedFollowings] = useState(user.following);
    const [updatedRequestIn, setUpdatedRequestIn] = useState(user.followRequestIn)
    

    useEffect(()=>{
        const updatedList = users.filter(user=>user.firstname.includes(search) || user.lastname.includes(search) || user.username.includes(search));
        setUpdatedUsers(updatedList);
        
        const updatedFollowing = user.following.filter(account=>account.includes(search) || getUser(users, account).firstname.includes(search) || getUser(users, account).lastname.includes(search));
        setUpdatedFollowings(updatedFollowing);

        const updatedRequest = user.followRequestIn.filter(account=>account.includes(search) || getUser(users, account).firstname.includes(search) || getUser(users, account).lastname.includes(search));
        setUpdatedRequestIn(updatedRequest);
    },[search, users])
    

    function isFollowing(account:string){
        if(username===account){
            return true;
        }
        let follow = false;
        user.following.map((fol)=>{
            if(fol===account) follow=true;
        })
        return follow;
    }

    function requestToFollow(account:string){
        let userHasReq = false;
        user.followRequestOut.map((req)=>{
            if(req===account){
                userHasReq = true;
            }
        })
        return userHasReq;
    }

    function handleFollow(username1:string, username2:string){
        if(username1===username2){
            return;
        }
        const user1 = getUser(users, username1);
        if(user1.public){
            dispatch({type: 'follow', username1:username1, username2:username2})
        }
        if(!user1.public){
            dispatch({type: 'followRequest', username1:username1, username2:username2})
        }
    }

    function allowFollowPrivate(account:string){
        if(username===account){
            return;
        }
        dispatch({type: 'allowFollowPrivate', username1:username, username2:account})
    }

    function cancelFollowRequest(account:string){
        if(username===account){
            return;
        }
        dispatch({type: 'cancelFollowRequest', username1:username, username2:account})
    }

    return (
        <div className="p-[20px]">
            <input className="w-1/1 border px-[6px]" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search" />
            <div className="my-[20px]">
                {updatedRequestIn.map((account)=>(
                    <div key={account} className="flex flex-row">
                        <span>
                            <i className="fa fa-user-circle" onClick={()=>navigate(`/${account}/profile`)} />
                        </span>
                        <div>
                            <div className="cursor-pointer" onClick={()=>navigate(`/${account}/profile`)}>@{account}</div>
                            <div className="font-bold">{getUser(users,account).firstname} {getUser(users,account).lastname}</div>
                        </div>
                        <div className="ml-auto flex items-center">
                            <span className="text-green-500 text-3xl mr-[10px]"><i className="fa fa-check-circle-o" onClick={()=>allowFollowPrivate(account)} /></span>
                            <span className="text-red-500 text-3xl"><i className="fa fa-times-circle-o" onClick={()=>cancelFollowRequest(account)} /></span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="my-[20px]">
                {updatedUsers.map((user)=>(
                    <div key={user.username}>
                        {requestToFollow(user.username) && 
                        <div className="flex flex-row my-[10px] items-center">
                            <span>
                                <i className="fa fa-user-circle" onClick={()=>navigate(`/${user.username}/profile`)} />
                            </span>
                            <div>
                                <div className="cursor-pointer hover:text-red-500" onClick={()=>navigate(`/${user.username}/profile`)}>@{user.username}</div>
                                <div className="font-bold">{user.firstname} {user.lastname}</div>
                            </div>
                            <div className="ml-auto">Requested</div>
                        </div>
                        }
                    </div>
                ))}
            </div>
            <div className="my-[20px]">
                {updatedFollowings.map((account)=>(
                    <div key={account} className="flex flex-row items-center">
                        <span>
                            <i className="fa fa-user-circle" onClick={()=>navigate(`/${account}/profile`)} />
                        </span>
                        <div>
                            <div className="cursor-pointer" onClick={()=>navigate(`/${account}/profile`)}>@{account}</div>
                            <div className="font-bold">{getUser(users,account).firstname} {getUser(users,account).lastname}</div>
                        </div>
                        <div className="ml-auto">Following</div>
                    </div>
                ))}
            </div>
            <div className="my-[20px]">
                {updatedUsers.map((user)=>(
                    <div key={user.username}>
                        {!isFollowing(user.username) && !requestToFollow(user.username) && 
                        <div className="flex flex-row my-[10px] items-center">
                            <span>
                                <i className="fa fa-user-circle" onClick={()=>navigate(`/${user.username}/profile`)} />
                            </span>
                            <div>
                                <div className="cursor-pointer hover:text-red-500" onClick={()=>navigate(`/${user.username}/profile`)}>@{user.username}</div>
                                <div className="font-bold">{user.firstname} {user.lastname}</div>
                            </div>
                            <button className="bg-blue-500 hover:bg-blue-400 rounded-xs cursor-pointer ml-auto h-[35px] w-[70px]" onClick={()=>handleFollow(user.username,username)}>Follow</button>
                        </div>
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RightSideBar;