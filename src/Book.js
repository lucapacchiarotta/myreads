import React, { Component } from 'react';
import PropTypes from 'prop-types'

class Book extends Component {
    static propTypes = {
        data: PropTypes.object,
        onChange: PropTypes.func.isRequired
    }

    handleChange = (event) => {
        if (this.props.onChange) {
            this.props.onChange(event.target.value)
            this.props.data.shelf = event.target.value
        }
      }

    render() {
        const {data} = this.props
        if (data.shelf === '' || data.shelf === undefined) {
            data.shelf = 'none';
        }
        let thumb = (data.imageLinks && data.imageLinks.smallThumbnail) ? data.imageLinks.smallThumbnail : ''
        
        return (
            <form>
                <div className="book">
                    <div className="book-top">
                        <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url("${thumb}")` }}></div>
                        <div className="book-shelf-changer">
                            <select value={data.shelf} onChange={(event) => this.handleChange(event)}>
                                <option value="moveTo" disabled>Move to...</option>
                                <option value="currentlyReading">Currently Reading</option>
                                <option value="wantToRead">Want to Read</option>
                                <option value="read">Read</option>
                                <option value="none">None</option>
                            </select>
                        </div>
                    </div>
                    <div className="book-title">{data.title}</div>
                    <div className="book-authors">
                        {data.authors && data.authors.map((author) => author)}
                    </div>
                </div>
            </form>
        )
    }
}

export default Book
