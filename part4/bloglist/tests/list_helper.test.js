const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})

describe('total likes', () => {
    test('of empty list is zero', () => {
        assert.strictEqual(listHelper.totalLikes([]), 0)
    })
    test('when list has only one blog equals the likes of that', () => {
        const likes = 99999999
        const blogs = [
            {
                title: "Not My Life",
                author: "Lokesh",
                url: "http://www.lokesh.com",
                likes
            }
        ]
        assert.strictEqual(listHelper.totalLikes(blogs), likes)
    })
    test('of a bigger list is calculated right', () => {
        const blogs = [
            {
                title: "My Life",
                author: "Lokesh",
                url: "http://www.lokesh.com",
                likes: 2
            },
            {
                title: "Not My Life",
                author: "Lokesh",
                url: "http://www.lokesh.com",
                likes: 3
            }
        ]
        assert.strictEqual(listHelper.totalLikes(blogs), 5)
    })
})

describe('favorite blogs', () => {
    test('of empty list is undefined', () => {
        assert.equal(listHelper.favoriteBlog([]), undefined)
    })
    test('when list has only one blog is itself', () => {
        const likes = 99999999
        const blogs = [
            {
                title: "Not My Life",
                author: "Lokesh",
                url: "http://www.lokesh.com",
                likes
            }
        ]
        assert.deepStrictEqual(listHelper.favoriteBlog(blogs), blogs[0])
    })
    test('of a bigger list is calculated right', () => {
        const blogs = [
            {
                title: "My Life",
                author: "Lokesh",
                url: "http://www.lokesh.com",
                likes: 2
            },
            {
                title: "Not My Life",
                author: "Lokesh",
                url: "http://www.lokesh.com",
                likes: 3
            }
        ]
        assert.deepStrictEqual(listHelper.favoriteBlog(blogs), blogs[1])
    })
    test('of a bigger list with duplicates is the last encountered favorite blog', () => {
        const blogs = [
            {
                title: "My Life",
                author: "Lokesh",
                url: "http://www.lokesh.com",
                likes: 2
            },
            {
                title: "Not My Life",
                author: "Lokesh",
                url: "http://www.lokesh.com",
                likes: 3
            },
            {
                title: "My Life1",
                author: "Lokesh1",
                url: "http://www.lokesh1.com",
                likes: 3
            },
            {
                title: "My Life3",
                author: "Lokesh3",
                url: "http://www.lokesh.com",
                likes: 2
            }
        ]
        assert.deepStrictEqual(listHelper.favoriteBlog(blogs), blogs[2])
    })
})

describe('most blogs by an author', () => {
    test('of empty list is undefined', () => {
        assert.equal(listHelper.mostBlogs([]), undefined)
    })
    test('when list has only one blog is its author', () => {
        const likes = 99999999
        const blogs = [
            {
                title: "Not My Life",
                author: "Lokesh",
                url: "http://www.lokesh.com",
                likes
            }
        ]
        assert.deepStrictEqual(listHelper.mostBlogs(blogs), {
            author: blogs[0].author,
            blogs: 1
        })
    })
    test('of a bigger list is calculated right', () => {
        const blogs = [
            {
                title: "My Life",
                author: "Lokesh",
                url: "http://www.lokesh.com",
                likes: 2
            },
            {
                title: "Not My Life",
                author: "Lokesh2",
                url: "http://www.lokesh.com",
                likes: 3
            },
            {
                title: "My Life",
                author: "Lokesh",
                url: "http://www.lokesh.com",
                likes: 5
            }
        ]
        assert.deepStrictEqual(listHelper.mostBlogs(blogs), {
            author: "Lokesh",
            blogs: 2
        })
    })
    test('of a bigger list with duplicates is the first encountered author with most blogs', () => {
        const blogs = [
            {
                title: "My Life",
                author: "Lokesh1",
                url: "http://www.lokesh.com",
                likes: 2
            },
            {
                title: "Not My Life",
                author: "Lokesh",
                url: "http://www.lokesh.com",
                likes: 3
            },
            {
                title: "My Life1",
                author: "Lokesh1",
                url: "http://www.lokesh1.com",
                likes: 3
            },
            {
                title: "My Life3",
                author: "Lokesh",
                url: "http://www.lokesh.com",
                likes: 2
            }
        ]
        assert.deepStrictEqual(listHelper.mostBlogs(blogs), {
            author: "Lokesh1",
            blogs: 2
        })
    })
})