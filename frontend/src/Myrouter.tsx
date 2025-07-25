import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Homepage from "./pages/Homepage"
import NewPost from "./pages/NewPost"
import Profile from "./pages/Profile"
import Setting from "./pages/Setting"
import Chats from "./pages/Chats"
import Singlechat from "./pages/SingleChat"

const Myrouter = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/:username/home' element={<Homepage />} />
                <Route path='/:username/newpost' element={<NewPost />} />
                <Route path='/:username/profile' element={<Profile />} />
                <Route path='/:username/setting' element={<Setting />} />
                <Route path='/:username/message' element={<Chats />} />
                <Route path="/:username/message/:username2" element={<Singlechat />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Myrouter