import React from 'react'
import { Route, Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import './App.css'
import Bookshelf from './Bookshelf'

class BooksApp extends React.Component {
    state = {
        // Books list for currently reading bookshelf
        booksReading: [],
        // Books list for wanted to read bookshelf
        booksWanted: [],
        // Books list for read bookshelf
        booksRead: []
    }

    componentDidMount() {
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

        /*
        BooksAPI.getAll().then( data => {
            console.log(data)
        })
        */
    }

    onChange(book, newBookshelf) {
        //alert('Ciao ' + book.title + ' Shelf: ' + newBookshelf)
        console.log('Ciao ' + book.title + ' Shelf ' + newBookshelf)
        //BooksAPI.update(book, )
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
                    <div className="search-books">
                        <div className="search-books-bar">
                            <Link className="close-search" to="/">Close</Link>
                            <div className="search-books-input-wrapper">
                                {/*
                                NOTES: The search from BooksAPI is limited to a particular set of search terms.
                                You can find these search terms here:
                                https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                                However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                                you don't find a specific author or title. Every search is limited by search terms.
                                */}
                                <input type="text" placeholder="Search by title or author"/>
                            </div>
                        </div>
                        <div className="search-books-results">
                            <ol className="books-grid"></ol>
                        </div>
                    </div>
                )} />

            </div>
        )
    }
}

export default BooksApp
