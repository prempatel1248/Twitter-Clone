import { useContext, useEffect, useState } from "react";
import LeftSideBar from "../components/LeftSideBar";
import RightSideBar from "../components/RightSideBar";
import { getUser } from "../utils/Functions";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Chats = () => {

    const users = useContext(UserContext);

    const navigate = useNavigate();

    const usertext = localStorage.getItem('currentUser') || '';
    const username = JSON.parse(usertext);
    const user = getUser(users, username);

    const [search, setSearch] = useState('');
    const [updatedChats, setUpdatedChats] = useState(user.chats);

    useEffect(()=>{
        const newChats = user.chats.filter(chat=> chat.username.includes(search) || getUser(users,chat.username).firstname.includes(search) || getUser(users, chat.username).lastname.includes(search));
        setUpdatedChats(newChats)
    },[search]);
    
    
    return (
        <div className="home h-screen flex flex-row relative">
            <div className={`leftsidebar w-15/100  flex flex-col items-center fixed h-1/1 ${user.lightTheme ? 'bg-neutral-200' : 'bg-neutral-800 text-white'}`}>
                <LeftSideBar />
            </div>
            <div className={`middlebar w-65/100 ml-[15%] mr-[20%] ${getUser(users,username).lightTheme ? '' : 'bg-black text-white'}`}>
                <div className={`${user.lightTheme ? 'bg-neutral-300' : 'bg-neutral-900'} navbar h-[150px] bg-neutral-200 flex items-center justify-center p-7`}>
                    <input className="h-[40px] w-1/2 rounded-xl py-0 px-5 text-xl border-none bg-white text-black" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search" />
                </div>
                <hr></hr>
                <div className="p-[20px]">
                    {updatedChats.map((chat)=>(
                        <div key={chat.username} className={`flex flex-row items-center my-[20px] cursor-pointer ${user.lightTheme ? 'hover:bg-neutral-200' : 'hover:bg-neutral-900'}`} onClick={()=>navigate(`/${username}/message/${chat.username}`)}>
                            <span>
                                <i className="fa fa-user-circle" />
                            </span>
                            <div>
                                <div className="cursor-pointer">@{chat.username}</div>
                                <div className="font-bold">{getUser(users,chat.username).firstname} {getUser(users,chat.username).lastname}</div>
                            </div>
                        </div>
                    ))}
                    {updatedChats.length===0 && <div className="text-3xl text-center">No Messages</div>}
                </div>
            </div>
            <div className={`rightsidebar w-20/100 fixed right-0 h-1/1 overscroll-y-auto ${user.lightTheme ? 'bg-neutral-200' : 'bg-neutral-800 text-white'}`}>
                <RightSideBar />
            </div>
        </div>
    )
}

export default Chats;
