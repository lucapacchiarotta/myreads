import React, { Component } from 'react';
import PropTypes from 'prop-types'

//import serializeForm from 'form-serialize'


class Book extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        authors: PropTypes.array.isRequired,
        images: PropTypes.object.isRequired,
        bookshelf: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired
    }

    handleChange = (event) => {
        if (this.props.onChange) {
            this.props.onChange(event.target.value)
        }
      }

    render() {
        const {title, authors, images, bookshelf} = this.props
        
        return (
            <form>
                <div className="book">
                    <div className="book-top">
                        <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url("${images.smallThumbnail} + '")` }}></div>
                        <div className="book-shelf-changer">
                            <select value={bookshelf} onChange={(event) => this.handleChange(event)}>
                                <option value="none" disabled>Move to...</option>
                                <option value="currentlyReading">Currently Reading</option>
                                <option value="wantToRead">Want to Read</option>
                                <option value="read">Read</option>
                                <option value="none">None</option>
                            </select>
                        </div>
                    </div>
                    <div className="book-title">{title}</div>
                    <div className="book-authors">
                        {authors.map((author) => author)}
                    </div>
                </div>
            </form>
        )
    }
}

export default Book
