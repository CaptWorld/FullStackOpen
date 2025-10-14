const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    return blogs.reduce((likes, blog) => likes + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (!blogs.length) return undefined
    else return blogs.reduce((currentFavoriteBlog, currentBlog) => currentFavoriteBlog.likes > currentBlog.likes ? currentFavoriteBlog : currentBlog, blogs[0])
}

const mostBlogs = (blogs) => {
    if (!blogs.length) return undefined
    let authorWithMostBlogs = blogs[0].author
    const frequencyMap = { [authorWithMostBlogs]: 1 }
    for (let i = 1; i < blogs.length; i++) {
        const currentAuthor = blogs[i].author
        if (!frequencyMap.hasOwnProperty(currentAuthor)) {
            frequencyMap[currentAuthor] = 1
        } else if (++frequencyMap[currentAuthor] > frequencyMap[authorWithMostBlogs]) {
            authorWithMostBlogs = currentAuthor;
        }
    }
    return {
        author: authorWithMostBlogs,
        blogs: frequencyMap[authorWithMostBlogs]
    }
}

const mostLikes = (blogs) => {
    if (!blogs.length) return undefined
    let authorWithMostLikes = blogs[0].author
    const likesMap = { [authorWithMostLikes]: blogs[0].likes }
    for (let i = 1; i < blogs.length; i++) {
        const currentAuthor = blogs[i].author
        const likesOfCurrentAuthor = blogs[i].likes
        if (!likesMap.hasOwnProperty(currentAuthor)) {
            likesMap[currentAuthor] = 0
        }
        likesMap[currentAuthor] += likesOfCurrentAuthor
        if (likesMap[currentAuthor] > likesMap[authorWithMostLikes]) {
            authorWithMostLikes = currentAuthor;
        }
    }
    return {
        author: authorWithMostLikes,
        likes: likesMap[authorWithMostLikes]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}