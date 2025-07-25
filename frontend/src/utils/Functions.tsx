import type { UserInterface } from "../models/UserInterface";

export function addUser(users:UserInterface[], username:string, password:string, firstname:string, lastname:string){
    const newUser:UserInterface = {
        username: username,
        password: password,
        firstname: firstname,
        lastname: lastname,
        following: [],
        followers: [],
        likes: [],
        lightTheme: true,
        public:true,
        followRequestIn: [],
        followRequestOut: [],
        notification: [],
        dmFromAnyone:true,
        chats: []
    }
    const updatedUsers = [...users, newUser];
    return updatedUsers;
}

export function getUser(users:UserInterface[], username:string){
    const user = users.filter(user=> user.username===username)
    return user[0];
}

