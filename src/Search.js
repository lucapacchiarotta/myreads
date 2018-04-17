import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Book from './Book'
import TextSearch from './TextSearch'

class Search extends Component {
    static propTypes = {
        bookList: PropTypes.array,
        bookSearch: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
        searchDataReceived: PropTypes.bool.isRequired,
        query: PropTypes.string
    }

    render() {
        const {bookList, bookSearch, onChange, query, searchDataReceived} = this.props
        let noData = ''
        if (searchDataReceived && bookList.length === 0 && query.trim() !== '') {
            noData = 'No data found'
        }
        
        return (
            <div className="search-books">
                <div className="search-books-bar">
                    <Link className="close-search" to="/">Close</Link>
                    <div className="search-books-input-wrapper">
                        <TextSearch placeholder="Search by title or author" onChange={(event) => bookSearch(event)} query={query} />
                    </div>
                </div>
                <div className="search-books-mex">
                    {noData}
                </div>
                <div className="search-books-results">
                    <ol className="books-grid">
                        {bookList.map((book) => 
                            <li key={book.id}>
                                <Book data={book} onChange={(newBookshelf) => onChange(book, newBookshelf)} />
                            </li>
                        )}
                    </ol>    
                </div>
            </div>
        )}
}

export default Search