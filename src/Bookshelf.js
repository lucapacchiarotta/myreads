import React, { Component } from 'react';
import PropTypes from 'prop-types'
import Book from './Book'


class Bookshelf extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        books: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired
    }

    state = {
    }


    render() {
        const {title, books, onChange} = this.props

        return (
            <div className="bookshelf">
                <h2 className="bookshelf-title">{ title }</h2>
                <div className="bookshelf-books">
                <ol className="books-grid">
                    {books.map((book) => (
                        <li key={book.title}>
                            <Book title={book.title} authors={book.authors} images={book.imageLinks} bookshelf={book.shelf}
                                onChange={(newBookshelf) => onChange(book, newBookshelf)}/>
                        </li>
                    ))}
                </ol>
                </div>
            </div>
        )
    }
}

export default Bookshelf
