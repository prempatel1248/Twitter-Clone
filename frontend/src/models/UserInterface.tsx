interface ChatInterface {
    chatId: string,
    who: string,
    message: string,
    date: string,
    EditedAt: string,
}

export interface UserInterface {
    username: string,
    password:string,
    firstname: string,
    lastname:string,
    following:string[],
    followers:string[],
    likes:string[],
    lightTheme:boolean,
    public: boolean,
    followRequestIn: string[],
    followRequestOut: string[],
    notification: {username:string, interaction:string, postId:string}[],
    dmFromAnyone: boolean,
    chats: {username: string, chat:ChatInterface[]}[]
}