import React from 'react'
import { Route, Link } from 'react-router-dom'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'
import * as BooksAPI from './BooksAPI'
import Bookshelf from './Bookshelf'
import Search from './Search'
import './App.css'


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
        // Inform the search component that we have received or not the data
        searchDataReceived: false,
        // Query for search function
        query: ''
    }

    refreshData() {
        // Reading bookshelf
        BooksAPI.getAll().then((data) => {
            let booksReading
            booksReading = data.filter((book) =>
                book.shelf === "currentlyReading"
            );
            this.setState({
                booksReading: booksReading
            });
        })

        // Want to read bookshelf
        BooksAPI.getAll().then((data) => {
            let booksWanted
            booksWanted = data.filter((book) =>
                book.shelf === "wantToRead"
            );
            this.setState({
                booksWanted: booksWanted
            });
        })

        // Read bookshelf
        BooksAPI.getAll().then((data) => {
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
        BooksAPI.update(book, newBookshelf).then((data) => {
            this.refreshData()
        })
    }

    bookSearch(event) {
        let booksList = []
        let query = event.target.value.trim()

        this.setState({
            query: query,
            booksSearched: booksList,
            searchDataReceived: false
        })

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

                        if (this.state.booksReading.length > 0 && 
                            this.state.booksReading.map((element) => 
                                booksList.map((elementList) => 
                                    elementList.shelf = elementList.id === element.id ? 'currentlyReading' : elementList.shelf
                                )
                        ))

                        if (this.state.booksWanted.length > 0 && 
                            this.state.booksWanted.map((element) => 
                                booksList.map((elementList) => 
                                    elementList.shelf = elementList.id === element.id ? 'wantToRead' : elementList.shelf
                                )
                        ))

                        if (this.state.booksRead.length > 0 && 
                            this.state.booksRead.map((element) => 
                                booksList.map((elementList) => 
                                    elementList.shelf = elementList.id === element.id ? 'read' : elementList.shelf
                            )
                        )); // Without semicolon I have a sintax error
                    }
                }

                this.setState({
                    booksSearched: booksList,
                    searchDataReceived: true
                })
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
                        query={this.state.query} 
                        searchDataReceived={this.state.searchDataReceived}/>
                )} />

            </div>
        )
    }
}

export default BooksApp
