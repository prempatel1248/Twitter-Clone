import { useContext, useEffect, useState } from "react";
import LeftSideBar from "../components/LeftSideBar"
import RightSideBar from "../components/RightSideBar"
import { getUser } from "../utils/Functions";
import { UserContext, UserDispatchContext } from "../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { PostDispatchContext } from "../context/PostContext";

const Setting = () => {

    const users = useContext(UserContext);
    const dispatch = useContext(UserDispatchContext);
    const postdispatch = useContext(PostDispatchContext);

    const usertext = localStorage.getItem('currentUser') || '';
    const username = JSON.parse(usertext);
    const user = getUser(users, username);

    const [lightTheme, setLightTheme] = useState(user.lightTheme);
    const [publicAccount, setPublicAccount] = useState(user.public);
    const [DmFromAnyone, setDmFromAnyone] = useState(user.dmFromAnyone);
    const [deleteAcc, setDeleteAcc] = useState(false);

    const navigate = useNavigate();

    const urlusername = useParams().username || '';
    useEffect(()=>{
        if(username!==urlusername){
            navigate('/');
        }
    },[]);

    useEffect(()=>{
        dispatch({type: 'changeThemeFromSetting', username:username, lightTheme:lightTheme});
    },[lightTheme]);

    useEffect(()=>{
        dispatch({type: 'changePublicPrivate', username:username, publicAccount:publicAccount});
    },[publicAccount]);

    useEffect(()=>{
        dispatch({type: 'changeDmSetting', username:username, DmFromAnyone:DmFromAnyone});
    },[DmFromAnyone]);

    function deleteAccount(){
        dispatch({type: 'deleteAccount', username:username});
        postdispatch({type: 'deleteAccount', username:username});
        navigate('/');
    }

    return (
        <div className="home h-screen flex flex-row relative">
            <div className={`leftsidebar w-15/100  flex flex-col items-center fixed h-1/1 ${user.lightTheme ? 'bg-neutral-200' : 'bg-neutral-800 text-white'}`}>
                <LeftSideBar />
            </div>
            <div className={`middlebar w-65/100 ml-[15%] mr-[20%] ${getUser(users,username).lightTheme ? '' : 'bg-black text-white'}`}>
                <div className="m-[40px] mt-[100px]">
                    <div className="flex justify-center mt-[50px]">
                        <div className="flex flex-col">
                            <div className="m-[30px] text-2xl">Theme</div>
                            <div className="m-[30px] text-2xl">Acount Type</div>
                            <div className="m-[30px] text-2xl">Allow messages from </div>
                        </div>
                        <div className="flex flex-col">
                            <select className="border m-[30px] text-2xl" value={user.lightTheme ? 'light' : 'dark'} onChange={e=>e.target.value==='light' ? setLightTheme(true) : setLightTheme(false)}>
                                <option className={`${!lightTheme && 'bg-black'}`} value={'light'}>Light</option>
                                <option className={`${!lightTheme && 'bg-black'}`} value={'dark'}>Dark</option>
                            </select>
                            <select className="border m-[30px] text-2xl" value={user.public ? 'public' : 'private'} onChange={e=>e.target.value==='public' ? setPublicAccount(true) : setPublicAccount(false)}>
                                <option className={`${!lightTheme && 'bg-black'}`} value={'public'}>Public</option>
                                <option className={`${!lightTheme && 'bg-black'}`} value={'private'}>Private</option>
                            </select>
                            <select className="border m-[30px] text-2xl" value={user.dmFromAnyone ? 'anyone' : 'followers'} onChange={e=>e.target.value==='anyone' ? setDmFromAnyone(true) : setDmFromAnyone(false)}>
                                <option className={`${!lightTheme && 'bg-black'}`} value={'anyone'}>Anyone</option>
                                <option className={`${!lightTheme && 'bg-black'}`} value={'followers'}>Only Followers</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-[50px] text-center">
                        {!deleteAcc && <button className="cursor-pointer bg-red-500 p-[10px] hover:bg-red-400" onClick={()=>setDeleteAcc(true)}>Delete Account</button>}
                        {deleteAcc && <div className="m-[10px]">
                            Are you sure you want to delete your account? This will permanently delete all your data. 
                            <div>
                                <button className="cursor-pointer bg-red-500 hover:bg-red-400 p-[10px] m-[10px] w-[80px]" onClick={deleteAccount}>Delete</button>
                                <button className="cursor-pointer bg-blue-500 hover:bg-blue-400 p-[10px] m-[10px] w-[80px]" onClick={()=>setDeleteAcc(false)}>Cancel</button>
                            </div>
                        </div>}
                    </div>
                    
                </div>
            </div>
            <div className={`rightsidebar w-20/100 fixed right-0 h-1/1 overscroll-y-auto ${user.lightTheme ? 'bg-neutral-200' : 'bg-neutral-800 text-white'}`}>
                <RightSideBar />
            </div>
        </div>
    )
}

export default Setting