import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUser } from "../utils/Functions";
import LeftSideBar from "../components/LeftSideBar";
import RightSideBar from "../components/RightSideBar";
import { PostDispatchContext } from "../context/PostContext";
import type { UserInterface } from "../models/UserInterface";
import { UserContext } from "../context/UserContext";

const NewPost = () => {

    const [contentInp, setContentInp] = useState('');
    const [success, setSuccess] = useState(false);
    const [Err, setErr] = useState(false);

    const users = useContext(UserContext)
    const postdispatch = useContext(PostDispatchContext);

    const username = useParams().username || '';
    const user:UserInterface = getUser(users, username);

    const navigate = useNavigate();
    useEffect(()=>{
        const usertext = localStorage.getItem('currentUser') || '';
        const currentUser = JSON.parse(usertext);
        if(currentUser!==username){
            navigate('/');
            return;
        }
    },[]);
    
    function handleAddPost(){
        if(contentInp===''){
            setSuccess(false);
            setErr(true);
            return;
        }
        setSuccess(true);
        setErr(false);
        postdispatch({type: 'addNewPost', username, firstname: user.firstname, lastname: user.lastname, content:contentInp, repost:''})
        setContentInp('');
    }

    return (
        <div className="h-screen flex flex-row">
            <div className={`leftsidebar w-15/100  flex flex-col items-center fixed h-1/1 ${getUser(users,username).lightTheme ? 'bg-neutral-200' : 'bg-neutral-800 text-white'}`}>
                <LeftSideBar />
            </div>
            <div className={`middlebar w-65/100 ml-[15%] mr-[20%] ${getUser(users,username).lightTheme ? '' : 'bg-black text-white'}`}>
                <div className="m-[40px] mt-[100px]">
                    <div className="text-5xl font-bold">New Post</div>
                    <div className="flex flex-col mt-[80px]">
                        <textarea className={`border h-[300px] w-1/1 rounded-xl py-5 px-5 text-xl mb-[30px] ${getUser(users,username).lightTheme ? 'bg-neutral-100' : 'bg-neutral-900'}`} value={contentInp} onChange={e=>setContentInp(e.target.value)} placeholder="What are you thinking..." />
                        <button className="bg-blue-500 hover:bg-blue-400 cursor-pointer h-[40px] w-[100px] ml-auto mb-[30px]" onClick={handleAddPost}>Post</button>
                    </div>
                    <div className="text-red-500 text-xl text-center">{Err && 'Post cannot be empty!'}</div>
                    <div className="text-green-500 text-xl text-center">{success && 'Post added successfully!'}</div>
                </div>
            </div>
            <div className={`rightsidebar w-20/100 fixed right-0 h-1/1 overflow-y-scroll ${getUser(users,username).lightTheme ? 'bg-neutral-200' : 'bg-neutral-800 text-white'}`}>
                <RightSideBar />
            </div>

        </div>
    )
}

export default NewPost;