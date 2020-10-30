import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BookmarksContext from '../BookmarksContext';
import config from '../config'
import './EditBookmark.css'

const Required = () => (
    <span className='EditBookmark__required'>*</span>
)

export default class EditBookmarkForm extends Component {
    static defaultProps = {
        match: {
            params: {
                bookmarkId: null
            }
        },
        history: {},
      };

    static propTypes = {
        match: PropTypes.shape({
            params: PropTypes.object,
        }),
        history: PropTypes.shape({
            push: PropTypes.func
        }).isRequired,
    }

    static contextType = BookmarksContext

    state = {
        error: null,
        id: '',
        title: '',
        url_path: '',
        descr: '',
        rating: 1,
    }
    componentDidMount() {
        const { bookmarkId } = this.props.match.params
        console.log(this.props)
        fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${config.API_KEY}`
            }
        })
        .then(res => {
            if(!res.ok) {
                return res.json().then(error => Promise.reject(error))
            }
            return res.json()
        })
        .then(responseData => {
            this.setState({
                id: responseData.id,
                title: responseData.title,
                url_path: responseData.url_path,
                descr: responseData.descr,
                rating: responseData.rating
            })
        })
        .catch(error => {
            console.log(error)
            this.setState({ error })
        })
       
    }

    handleChangeTitle = e => {
        this.setState({ title: e.target.value })
    }

    handleChangeUrl = e => {
        this.setState({ url_path: e.target.value })
    }

    handleChangeDescription = e => {
        this.setState({ descr: e.target.descr })
    }

    handleChangeRating = e => {
        this.setState({ rating: e.target.value })
    }

    handleSubmit = e => {
        e.preventDefault()
        const { bookmarkId } = this.props.match.params
        const { id, title, url_path, descr, rating } = this.state
        const newBookmark = { id, title, url_path, descr, rating }
            
        fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
            method: 'PATCH',
            body: JSON.stringify(newBookmark),
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${config.API_KEY}`
            },
            })
            .then(res => {
                if (!res.ok)
                return res.json().then(error => Promise.reject(error))
            })
            .then(() => {
                this.resetFields(newBookmark)
                this.context.updateBookmark(newBookmark)
                this.props.history.push('/')
            })
            .catch(error => {
                console.error(error)
                this.setState({ error })
            })
    }

    resetFields = (newFields) => {
        this.setState({
          id: newFields.id || '',
          title: newFields.title || '',
          url_path: newFields.url_path || '',
          descr: newFields.descr || '',
          rating: newFields.rating || '',
        })
      }
    
      handleClickCancel = () => {
        this.props.history.push('/')
      };

    render(){
        const { error, title, url_path, descr, rating } = this.state
        return (
            <section className='EditBookmarkForm'>
                <h2>Edit Bookmark</h2>
                <form
                className='EditBookmark__form'
                onSubmit={this.handleSubmit}
                >
                    <div className='EditBookmark__error' role='alert'>
                        {error && <p>{error.message}</p>}
                    </div>
                    <input
                    type='hidden'
                    name='id'
                    />
                    <div>
                        <label htmlFor='title'>
                            title{' '}
                            <Required />
                        </label>
                        <input 
                        type='text'
                        name='title'
                        id='title'
                        placeholder='Great website!'
                        required
                        value={title}
                        onChange={this.handleChangeTitle}
                        />
                    </div>
                    <div>
                        <label htmlFor='url_path'>
                            URL
                            {' '}
                            <Required />
                        </label>
                        <input 
                        type='url'
                        name='url_path'
                        id='url_path'
                        placeholder='https://www.great-website.com/'
                        required
                        value={url_path}
                        onChange={this.handleChangeUrl}
                        />
                    </div>
                    <div>
                        <label htmlFor='rating' >
                            Rating
                            {' '}
                            <Required />
                        </label>
                        <input 
                        type='number'
                        name='rating'
                        id='rating'
                        min='1'
                        max='5'
                        required
                        value={rating}
                        onChange={this.handleChangeRating}
                        />
                    </div>
                    <div>
                        <label htmlFor='descr'>
                        Description
                        </label>
                        <textarea
                        name='descr'
                        id='descr'
                        value={descr}
                        onChange={this.handleChangeDescription}
                        />
                    </div>
                    <div className='EditBookmark__buttons'>
                        <button type='button' onClick={this.handleClickCancel}>
                            Cancel
                        </button>
                        {' '}
                        <button type='submit'>
                            Save
                        </button>
                    </div>
                </form>
            </section>
        )
    }
}