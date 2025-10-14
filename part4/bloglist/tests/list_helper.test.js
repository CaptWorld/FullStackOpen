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