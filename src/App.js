import React from 'react'
import { Route, Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import './App.css'
import Bookshelf from './Bookshelf'
import Search from './Search'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'

class BooksApp extends React.Component {
    state = {
        // Books list for currently reading bookshelf
        booksReading: [],
        // Books list for wanted to read bookshelf
        booksWanted: [],
        // Books list for read bookshelf
        booksRead: [],
        // Books list of searched items
        booksSearched: [],
        // QUery for search function
        query: ''
    }

    refreshData() {
        // Reading bookshelf
        BooksAPI.getAll().then( data => {
            let booksReading
            booksReading = data.filter( (book) =>
                book.shelf === "currentlyReading"
            );
            this.setState({
                booksReading: booksReading
            });
        })

        // Want to read bookshelf
        BooksAPI.getAll().then(data => {
            let booksWanted
            booksWanted = data.filter((book) =>
                book.shelf === "wantToRead"
            );
            this.setState({
                booksWanted: booksWanted
            });
        })

        // Read bookshelf
        BooksAPI.getAll().then(data => {
            let booksRead
            booksRead = data.filter((book) =>
                book.shelf === "read"
            );
            this.setState({
                booksRead: booksRead
            });
        })
    }

    componentDidMount() {
        this.refreshData()
    }

    onChange(book, newBookshelf) {
        BooksAPI.update(book, newBookshelf).then(data => {
            this.refreshData()
        })
    }

    bookSearch(event) {
        let booksList = []
        let query = event.target.value.trim()

        this.setState({
            booksSearched: booksList,
            query: query
        })

        console.log("Query: " + query)
        console.log("state.query: " + this.state.query)
        if (query !== '') {
            BooksAPI.search(query).then((data) => {
                if (data.error) {
                    console.log("No result found")
                } else {
                    if (data.length > 0) {
                        const exp = escapeRegExp(query)
                        const match = new RegExp(exp, 'i')
                        booksList = data.filter((book) =>
                            match.test(book.title) || match.test(book.authors.join(','))
                        )
                        booksList.sort(sortBy('title'))
                        this.setState({
                            booksSearched: booksList
                        })
                        
                    }
                }
            })
        }
    }

    render() {
        return (
            <div className="app">

                <Route exact path='/' render={() => (
                    <div className="list-books">
                    <div className="list-books-title">
                        <h1>MyReads</h1>
                    </div>
                    <div className="list-books-content">
                        <div>
                            <Bookshelf title="Currently Reading" books={this.state.booksReading} onChange={
                                (book, newBookshelf) => this.onChange(book, newBookshelf)} />
                            <Bookshelf title="Want to Read" books={this.state.booksWanted} onChange={
                                (book, newBookshelf) => this.onChange(book, newBookshelf)} />
                            <Bookshelf title="Read" books={this.state.booksRead} onChange={
                                (book, newBookshelf) => this.onChange(book, newBookshelf)} />
                        </div>
                    </div>
                    <div className="open-search">
                        <Link to="/search">Add a book</Link>
                    </div>
                </div>
                )} />

                <Route exact path='/search' render={({ history }) => (
                    <Search bookList={this.state.booksSearched} 
                        bookSearch={(event) => this.bookSearch(event)}
                        onChange={(book, newBookshelf) => this.onChange(book, newBookshelf)} 
                        query={this.state.query} />
                )} />

            </div>
        )
    }
}

export default BooksApp
