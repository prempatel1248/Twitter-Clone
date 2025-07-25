import { useContext, useEffect, useState } from "react";
import './login.css';
import { useNavigate } from "react-router-dom";
import { UserContext, UserDispatchContext } from "../context/UserContext";

const Signup = () => {

    const navigate = useNavigate();
    const users = useContext(UserContext);
    const dispatch = useContext(UserDispatchContext);

    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState(false);
    const [userPresent, setUserPresent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [usernameErr, setUsernameErr] = useState(false);
    const [usernameErr2, setUsernameErr2] = useState(false);
    const [firstnameErr, setFirstnameErr] = useState(false);
    const [lastnameErr, setLastnameErr] = useState(false);
    const [passwordErr, setPasswordErr] = useState(false);
    const [passwordLength, setPasswordLength] = useState(false);

    useEffect(()=>{
        if(username.includes(' ')){
            setUsernameErr(true);
            return;
        }
        if(username===''){
            setUsernameErr2(true);
        }
        if(username!==''){
            setUsernameErr2(false);
        }
        setUsernameErr(false);
    }, [username]);

        useEffect(()=>{
            if(firstName===''){
                setFirstnameErr(true);
            }
            else{
                setFirstnameErr(false);
            }
        },[firstName]);
    
    useEffect(()=>{
        if(lastName===''){
            setLastnameErr(true);
        }
        else{
            setLastnameErr(false);
        }
    },[lastName]);
    
    useEffect(()=>{
        if(password===''){
            setPasswordErr(true);
        }
        else{
            if(password.length<8){
                setPasswordLength(true);
            }
            if(password.length>=8){
                setPasswordLength(false);
            }
            setPasswordErr(false);
        }
    },[password]);
    
    useEffect(()=>{
        setUsernameErr2(false);
        setFirstnameErr(false);
        setLastnameErr(false);
        setPasswordErr(false);
        setPasswordLength(false);
    },[]);

    function signup(){
        if(username===''){
            setUsernameErr2(true);
        }
        if(firstName===''){
            setFirstnameErr(true);
        }
        if(lastName===''){
            setLastnameErr(true);
        }
        if(password===''){
            setPasswordErr(true);
        }
        if(firstName=='' || lastName=='' || username=='' || password=='' || password.length<8){
            return;
        }
        if(usernameErr){
            return;
        }
        let checkuserpresent = false;
        users.map((user)=>{
            if(user.username===username){
                setUserPresent(true);
                checkuserpresent = true
                return;
            }
        })
        if(checkuserpresent){
            setFirstName('');
            setLastName('');
            setUsername('');
            setPassword('');
            setErr(false);
            return;
        }
        dispatch({type: 'addUser', username:username, password:password, firstname:firstName, lastname:lastName});
        localStorage.setItem('currentUser', JSON.stringify(username));
        navigate(`/${username}/home`);

        // const userData = {
        //     username, password, firstName, lastName
        // }
        // const response = await axios.post('http://localhost:3001/api/auth/signup', userData);
        // console.log("response: ", response);
        // if(response.status===409){
        //     setFirstName('');
        //     setLastName('');
        //     setUsername('');
        //     setPassword('');
        //     setErr(false);
        //     setUserPresent(true);
        //     return
        // }
        // if(response.status===201){
        //     navigate(`/${username}/home`);
        // }
    }


    return (
        <div className="loginpage bg-neutral-950 text-white">
            <div className="login-header">
                <span>
                    <i className='fa fa-twitter login-fa-twitter' />
                </span>
                <div className="text-7xl z-1 font-bold">Sign Up</div>
            </div>
            <div className="h-[65%] w-[30%] z-1 p-[30px] border opacity-75 border-3xl rounded-sm bg-neutral-950 flex flex-col items-center justify-between">
                <div className="flex flex-col items-center">
                    <div className="flex flex-col mb-[30px]">
                        <label className="text-base h-[22px]">{username!=='' && 'Username'}</label>
                        <input className="border p-[4px]" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" />
                        <div className="text-sm text-red-400 h-[5px] mt-[3px]">{(usernameErr2 && 'Username should not be empty') || (usernameErr && 'Username should not contain blank space')}</div>
                    </div>
                    <div className="flex flex-col mb-[30px]">
                        <label className="text-base h-[22px]">{firstName!=='' && 'First Name'}</label>
                        <input className="border p-[4px]" value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="First Name" />
                        <div className="text-sm text-red-400 h-[5px] mt-[3px]">{firstnameErr && 'First Name should not be empty'}</div>
                    </div>
                    <div className="flex flex-col mb-[30px]">
                        <label className="text-base h-[22px]">{lastName!=='' && 'Last Name'}</label>
                        <input className="border p-[4px]" value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="Last Name" />
                        <div className="text-sm text-red-400 h-[5px] mt-[3px]">{lastnameErr && 'Last Name should not be empty'}</div>
                    </div>
                    <div className="flex flex-col mb-[30px]">
                        <label className="text-base h-[22px]">{password!=='' && 'Password'}</label>
                        <div className="relative">
                            <input className="border p-[4px]" type={showPassword ? 'text' : 'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
                            <span className="absolute top-[10%] right-[6%]" onClick={()=>setShowPassword(!showPassword)}>
                                <i className={`fa ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`} />
                            </span>
                        </div>
                        <div className="text-sm text-red-400 h-[5px] mt-[3px]">{(passwordErr && 'Password should not be empty') || (passwordLength && 'Password must be atleast 8 characters long')}</div>
                    </div>
                </div>
                <div>
                    <button className="cursor-pointer bg-blue-500 hover:bg-blue-400 w-[300px] h-[50px] mb-[20px]" onClick={signup}>Signup</button>
                    <div className="cursor-pointer hover:text-blue-500 mb-[10px] text-center" onClick={()=>navigate('/')}>Login</div>
                </div>
            </div>
            <div className="z-1">
                <div id="login-err-message">{err && 'All feild are required!'}</div>
                <div id="userPresent-err-message" className="mb-[10px]">{userPresent && 'Username already exists!'}</div>
            </div>
            
        </div>
    )
}

export default Signup;