import React, { Component } from 'react';
import PropTypes from 'prop-types'

const WAIT_INTERVAL = 400;

export default class TextSearch extends Component {
    static propTypes = {
        placeholder: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        query: PropTypes.string
    }

    state = {
        timer: null,
        timeout: 0
    }

    componentWillMount() {
        this.timer = null;
    }

    handleChange(event, onChange) {
        if (this.timeout) {
            clearTimeout(this.timeout)
        }
        event.persist()
        this.timeout = setTimeout(() => onChange(event), WAIT_INTERVAL)
    }

    render() {
        const {placeholder, onChange, query} = this.props;
        
        return (
            <input type="text" 
                placeholder={placeholder}
                onChange={(event) => this.handleChange(event, onChange)}
                defaultValue={query} />
        )
    }
}