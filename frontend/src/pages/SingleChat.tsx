import { useContext, useEffect, useState } from "react";
import LeftSideBar from "../components/LeftSideBar"
import RightSideBar from "../components/RightSideBar"
import { getUser } from "../utils/Functions"
import { UserContext, UserDispatchContext } from "../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import {v4 as uuidv4} from "uuid";

const Singlechat = () => {

    const users = useContext(UserContext);
    const dispatch = useContext(UserDispatchContext);

    const username = useParams().username || '';
    const user = users.filter(user=> user.username===username)[0]
    const username2 = useParams().username2 || '';

    const usertext = localStorage.getItem('currentUser') || '';
    const currentUser = JSON.parse(usertext);

    const navigate = useNavigate();

    const chatVar = user.chats.filter(c=>c.username===username2)[0]
    const [chatState, setChatState] = useState(chatVar || {username:username2, chat:[]});
    const [chattext, setChattext] = useState('');

    useEffect(()=>{
        if(username!==currentUser){
            navigate('/');
        }
    },[]);

    function handleSendMessage(){
        if(editing){
            submitEditedMsg();
            return;
        }
        if(chattext==''){
            return;
        }
        const newMessage = {
            chatId: uuidv4(),
            who: username,
            message: chattext,
            date: new Date().toLocaleString('en-GB'),
            EditedAt: ''
        };
        const updatedChat = {...chatState, chat:[...chatState.chat, newMessage]}
        setChatState(updatedChat);
        setChattext('');
    }
    
    useEffect(()=>{
        if(chatState.chat.length==0){
            return;
        }
        dispatch({type:'saveMessage', username:username, username2:username2, chatState:chatState})
        dispatch({type:'saveMessage', username:username2, username2:username, chatState:{username:username, chat:chatState.chat}})
    },[chatState]);

    const [visible, setVisible] = useState(false);
    const [postion, setPosition] = useState({x:0,y:0});

    const [editing, setEditing] = useState(false);
    const [editChatId, setEditChatId] = useState('');

    function handleContextMenu(e:any, who:string, chatId:string, message:string){
        if(who===username2){
            return;
        }
        if(message===''){
            return;
        }
        e.preventDefault();
        setEditChatId(chatId)
        setPosition({ x: e.clientX, y: e.clientY });
        setVisible(true);
    }

    function handleEditMsg(){
        setEditing(true);
        const textmsg = user.chats.filter(uname=>uname.username===username2)[0].chat.filter(eachmsg=>eachmsg.chatId===editChatId)[0].message;
        setChattext(textmsg);
    }

    function submitEditedMsg(){
        if(chattext===''){
            setEditing(false);
            return;
        }
        const msg = chatState.chat.filter(c=>c.chatId===editChatId)[0];
        const datetime = new Date().toLocaleString('en-GB')
        const updatedMessage = {...msg, message:chattext, EditedAt:datetime};
        setEditing(false);
        setChattext('');
        const updatedChat = chatState.chat.map((chat)=>{
            if(chat.chatId===updatedMessage.chatId){
                return updatedMessage
            }
            return chat
        });
        setChatState({...chatState, chat:updatedChat});
    }

    function handleDeleteMsg(){
        const updatedState = chatState.chat.map((eachChat=>{
            if(eachChat.chatId===editChatId){
                return {...eachChat, message:""}
            }
            return eachChat;
        }));
        setChatState({...chatState, chat:updatedState});
    }

    function cancelEditing(){
        setEditing(false);
        setChattext('');
    }



    return (
        <div className="profile h-screen flex flex-row">
            <div className={`leftsidebar w-15/100  flex flex-col items-center fixed h-1/1 ${getUser(users, currentUser).lightTheme ? 'bg-neutral-200' : 'bg-neutral-800 text-white'}`}>
                <LeftSideBar />
            </div>

            <div onClick={()=>setVisible(false)} className={`middlebar w-65/100 ml-[15%] mr-[20%] ${getUser(users, currentUser).lightTheme ? '' : 'bg-neutral-900 text-white'}`}>
                <div className={`${user.lightTheme ? 'bg-neutral-300' : 'bg-black border-none'} flex items-center py-[20px] pr-[20px] border`}>
                    <span className="mx-[10px]"><i className="fa fa-chevron-left" onClick={()=>navigate(`/${username}/message`)} /></span>
                    <span>
                        <i className="fa fa-user-circle fa-user-circle-single-chat" />
                    </span>
                    <div className="ml-[20px]">
                        <div className="text-4xl font-bold">{getUser(users, username2).firstname} {getUser(users,username2).lastname}</div>
                    </div>
                        <div className="text-xl ml-auto">@{username2}</div>
                </div>
                <div className="h-[77%] overflow-y-auto p-[10px]">
                    {chatState.chat.map((msg,index)=>(
                        <div key={index} className={`flex p-[5px] ${msg.who===username ? 'justify-end' : 'justify-start'}`}>
                            <div className="flex flex-col max-w-[75%]" onContextMenu={e=>handleContextMenu(e, msg.who, msg.chatId, msg.message)}>
                                <div className={`${user.lightTheme ? 'bg-neutral-300':'bg-neutral-700'} text-lg p-[5px] w-fit ${msg.who===username ? 'ml-auto' : 'mr-auto'} ${msg.message==='' && 'text-sm italic'}`}>{msg.message==='' ? `this message was deleted` : `${msg.message}`}</div>
                                {msg.message!=='' && <div className={`text-sm ${msg.who===username ? 'ml-auto' : 'mr-auto'}`}>{msg.EditedAt==="" ? `${msg.date}` : `Edited ${msg.EditedAt}`}</div>}
                            </div>
                            {visible && 
                            <div className={`z-2 text-red-500 absolute left-[${postion.x}px] top-[${postion.y}px] bg-black text-lg cursor-pointer h-[77px] w-[65px] flex flex-col items-center justify-evenly`}>
                                <div className={`hover:bg-neutral-900 w-[100%] h-[100%] text-center p-[5px]`} onClick={handleEditMsg}>Edit</div>
                                <div className={`hover:bg-neutral-900 w-[100%] h-[100%] text-center p-[5px]`} onClick={handleDeleteMsg}>Delete</div>
                            </div>}
                        </div>
                    ))}
                </div>
                <div className={`flex h-[90px] p-[20px] w-65/100 items-center justify-evenly absolute bottom-0 ${getUser(users, currentUser).lightTheme ? 'bg-neutral-300' : 'bg-neutral-950 text-white'}`}>
                    <input className={`${editing ? 'w-90/100' : 'w-93/100'} p-[6px] h-[40px] border`} value={chattext} onChange={e=>setChattext(e.target.value)} placeholder="Message.." />
                    <div className="w-7/100 text-center flex items-center justify-evenly">
                        <i className="fa fa-send mr-[10px]" onClick={handleSendMessage} />
                        {editing && 
                            <button className="bg-red-500 p-[5px]" onClick={cancelEditing}>Cancel</button>}
                    </div>
                </div>
            </div>

            <div className={`rightsidebar w-20/100 fixed right-0 h-1/1 overscroll-y-auto ${getUser(users, currentUser).lightTheme ? 'bg-neutral-200' : 'bg-neutral-800 text-white'}`}>
                <RightSideBar />
            </div>
        </div>
    )
}

export default Singlechat
