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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}