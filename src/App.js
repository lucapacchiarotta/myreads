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
        BooksAPI.getAll().then((data) => {
            let booksReading =  []
            booksReading = data.filter((book) =>
                book.shelf === 'currentlyReading'
            )
            
            let booksWanted =  []
            booksWanted = data.filter((book) =>
                book.shelf === 'wantToRead'
            )
            
            let booksRead =  []
            booksRead = data.filter((book) =>
                book.shelf === 'read'
            )
            
            this.setState({
                booksReading,
                booksWanted,
                booksRead
            })
        })
    }

    componentDidMount() {
        this.refreshData()
    }

    onChange(book, newBookshelf, collection, fromSearch) {
        // Update for the local state
        collection.map((bookInList, index) => 
            bookInList.id === book.id && !fromSearch && collection.splice(index, 1)
        )
        
        newBookshelf === 'currentlyReading' && this.setState((state) => ({
            booksReading: state.booksReading.concat(book)
        }))

        newBookshelf === 'wantToRead' && this.setState((state) => ({
            booksWanted: state.booksWanted.concat(book)
        }))

        newBookshelf === 'read' && this.setState((state) => ({
            booksRead: state.booksRead.concat(book)
        }))

        // Update the data on the server
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

                        booksList.map((elementList) => {
                            this.state.booksReading.length > 0 && 
                                this.state.booksReading.map((element) => 
                                    elementList.shelf = elementList.id === element.id ? 'currentlyReading' : elementList.shelf
                            )

                            this.state.booksWanted.length > 0 && 
                                this.state.booksWanted.map((element) => 
                                    elementList.shelf = elementList.id === element.id ? 'wantToRead' : elementList.shelf
                            )

                            this.state.booksRead.length > 0 && 
                                this.state.booksRead.map((element) => 
                                    elementList.shelf = elementList.id === element.id ? 'read' : elementList.shelf
                            )
                            return elementList  
                        })
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
                                (book, newBookshelf) => this.onChange(book, newBookshelf, this.state.booksReading, false)} />
                            <Bookshelf title="Want to Read" books={this.state.booksWanted} onChange={
                                (book, newBookshelf) => this.onChange(book, newBookshelf, this.state.booksWanted, false)} />
                            <Bookshelf title="Read" books={this.state.booksRead} onChange={
                                (book, newBookshelf) => this.onChange(book, newBookshelf, this.state.booksRead, false)} />
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
                        onChange={(book, newBookshelf) => this.onChange(book, newBookshelf, this.state.booksSearched, true)} 
                        query={this.state.query} 
                        searchDataReceived={this.state.searchDataReceived}/>
                )} />

            </div>
        )
    }
}

export default BooksApp
