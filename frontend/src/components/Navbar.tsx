// import { useContext } from 'react';
// import '../pages/homepage.css'
// import type { ChangeThemeInterface } from '../utils/ChangeThemeInterface';
// import { UserContext } from '../App';
// import { useParams } from 'react-router-dom';
// import { getUser } from '../utils/Functions';

// const Navbar = ({handleChangeTheme}:ChangeThemeInterface) => {

//     const users = useContext(UserContext);
//     const username = useParams().username || '';
//     const user = getUser(users, username);

//     return (
//         <div className="navbar">
//             <input placeholder="Search" />
//             <span onClick={()=>handleChangeTheme(user.username)}>
//                 <i className={user.lightTheme ? "fa fa-moon-o" : "fa fa-sun-o"}></i>
//             </span>
//         </div>
//     )
// }

// export default Navbar;