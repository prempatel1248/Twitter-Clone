import { useContext, useEffect, useState } from "react";
import './login.css'
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Login = () => {

    const navigate = useNavigate();
    const users = useContext(UserContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [invalidcredential, setInvalidcredential] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [usernameErr, setUsernameErr] = useState(false);
    const [passwordErr, setPasswordErr] = useState(false);

    function login(){
        if(username=='' || password==''){
            setUsernameErr(true);
            setPasswordErr(true);
            return;
        }
        let validuser = false;
        users.map((user)=>{
            if(user.username===username && user.password===password){
                validuser=true;
                return;
            }
        })
        if(!validuser){
            setInvalidcredential(true);
            return;
        }
        localStorage.setItem('currentUser', JSON.stringify(username));
        navigate(`/${username}/home`);
    }

    useEffect(()=>{
        if(username===''){
            setUsernameErr(true);
        }
        else{
            setUsernameErr(false);
        }
    },[username]);

    useEffect(()=>{
        if(password==''){
            setPasswordErr(true);
        }
        else{
            setPasswordErr(false);
        }
    },[password]);

    useEffect(()=>{
        setUsernameErr(false);
        setPasswordErr(false);
    },[]);

    return (
        <div className="loginpage bg-neutral-950 text-white">
                <span>
                    <i className='fa fa-twitter login-fa-twitter' />
                </span>
            <div className="login-header z-1">
                <div className="text-7xl font-bold">Login</div>
            </div>
            <div className="h-[50%] w-[30%] z-1 border opacity-75 border-3xl rounded-sm bg-neutral-950 flex flex-col items-center justify-between">
                <div className="flex flex-col items-center">
                    <div className="mt-[70px] flex flex-col">
                        <label className="text-base h-[22px]">{username!=='' && 'Username'}</label>
                        <input className="border p-[4px] bg-black" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" />
                        <div className="text-sm text-red-400 h-[5px] mt-[3px]">{usernameErr && 'Username should not be empty'}</div>
                    </div>
                    <div className="mt-[40px] flex flex-col">
                        <label className="text-base h-[22px]">{password!=='' && 'Password'}</label>
                        <div className="relative">
                            <input className="border p-[4px] bg-black" type={showPassword ? 'text' : 'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
                            <span className="absolute top-[10%] right-[8%]" onClick={()=>setShowPassword(!showPassword)}>
                                <i className={`fa ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`} />
                            </span>
                        </div>
                        <div className="text-sm text-red-400 h-[5px] mt-[3px]">{passwordErr && 'Password should not be empty'}</div>
                    </div>
                </div>
                <div>
                    <button className="cursor-pointer bg-blue-500 hover:bg-blue-400 w-[300px] h-[50px]" onClick={login}>Login</button>
                    <div className="cursor-pointer hover:text-blue-500 m-[30px] text-center" onClick={()=>navigate('/signup')}>Signup</div>
                </div>
            </div>
            <div className="z-1">
                <div id="userPresent-err-message">{invalidcredential && 'Invalid Credentials!'}</div>
            </div>
        </div>
    )
}

export default Login;