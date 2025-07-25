export interface PostInterface {
    id: string,
    username: string,
    firstname: string,
    lastname: string,
    content: string,
    repost: string,
    reply: {username:string, content:string}[]
    likes: string[],
    date: string,
    editedAt: string
}