import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const LeftSideBar = () => {

    const navigate = useNavigate();
    const usertext = localStorage.getItem('currentUser') || '';
    const username = JSON.parse(usertext);

    const [page, setPage] = useState('');
    
    const location = useLocation();
    useEffect(()=>{
        const path = location.pathname;
        if(path.includes('home')){
            setPage('home');
        }
        if(path.includes('message')){
            setPage('message');
        }
        if(path.includes('newpost')){
            setPage('newpost');
        }
        if(path.includes('setting')){
            setPage('setting');
        }
        if(path.includes('profile')){
            setPage('profile');
        }
    },[])

    function handleLogout(){
        localStorage.setItem('currentUser', '');
        navigate('/');
    }

    function handleNavigation(to:string){
        setPage(to);
        navigate(`/${username}/${to}`);
    }

    return (
        <>
            <div className='logo-container h-[170px] w-1/1 flex justify-center items-center'>
                <span>
                    <i className='fa fa-twitter' />
                </span>
            </div>
            <div className='quick-links h-1/2 w-1/1 flex flex-col justify-evenly items-center list-none text-[1.8rem]'>
                <li className={`hover:cursor-pointer hover:text-blue-500 ${page==='home' && 'text-blue-400'}`} onClick={()=>handleNavigation('home')}>Home</li>
                <li className={`hover:cursor-pointer hover:text-blue-500 ${page==='message' && 'text-blue-400'}`} onClick={()=>handleNavigation('message')}>Message</li>
                <li className={`hover:cursor-pointer hover:text-blue-500 ${page==='newpost' && 'text-blue-400'}`} onClick={()=>handleNavigation('newpost')}>New Post</li>
                <li className={`hover:cursor-pointer hover:text-blue-500 ${page==='setting' && 'text-blue-400'}`} onClick={()=>handleNavigation('setting')}>Settings</li>
                <li className={`hover:cursor-pointer hover:text-blue-500 ${page==='profile' && 'text-blue-400'}`} onClick={()=>handleNavigation('profile')}>Profile</li>
            </div>
            <div className='logout-btn absolute bottom-[70px] w-17/100 h-[19px] flex justify-center items-center'>
                <button className='rounded-xs py-3 px-15 border-[2px] border-transparent hover:border-blue-500 hover:text-blue-500 hover:cursor-pointer' onClick={handleLogout}>Logout</button>
            </div>
        </>
    )
}

export default LeftSideBar;