import { useContext, useEffect } from "react";
import LeftSideBar from "../components/LeftSideBar";
import MainDashboard from "../components/MainDashboard";
import RightSideBar from "../components/RightSideBar";
import './homepage.css'
import { useNavigate, useParams } from "react-router-dom";
import { getUser } from "../utils/Functions";
import { UserContext } from "../context/UserContext";


const Homepage = () => {

    const username = useParams().username || '';

    const navigate = useNavigate();
    useEffect(()=>{
        const usertext = localStorage.getItem('currentUser') || '';
        const currentUser = JSON.parse(usertext);
        if(currentUser!==username){
            navigate('/');
            return;
        }
    },[]);

    const users = useContext(UserContext);
    const lightTheme = getUser(users, username).lightTheme

    return (
        <div className="home h-screen flex flex-row relative">
            <div className={`leftsidebar w-15/100  flex flex-col border-r items-center fixed h-1/1 ${lightTheme ? 'bg-neutral-200' : 'bg-neutral-800 text-white'}`}>
                <LeftSideBar />
            </div>
            <div className={`middlebar w-65/100 ml-[15%] overflow-y-scroll mr-[20%] opacity-99 ${lightTheme ? '' : 'bg-black text-white'}`}>
                <MainDashboard />
            </div>
            <div className={`rightsidebar w-20/100 fixed right-0 h-1/1 overscroll-y-auto ${lightTheme ? 'bg-neutral-200' : 'bg-neutral-800 text-white'}`}>
                <RightSideBar />
            </div>
        </div>
    )
}

export default Homepage;