import React, { Component } from  'react';
import BookmarksContext from '../BookmarksContext';
import config from '../config'
import './AddBookmark.css';

const Required = () => (
  <span className='AddBookmark__required'>*</span>
)

class AddBookmark extends Component {
  
constructor() {
  super()
  this.state = {
    error: null,
  };
}
  static contextType = BookmarksContext;

  handleSubmit = e => {
    e.preventDefault()
    // get the form fields from the event
    const { title, url_path, descr, rating } = e.target
    const bookmark = {
      title: title.value,
      url_path: url_path.value,
      descr: descr.value,
      rating: Number(rating.value),
    }
    this.setState({ error: null })
    fetch(config.API_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(bookmark),
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          // get the error message from the response,
          return res.json().then(error => {
            // then throw it
            throw error
          })
        }
        return res.json()
      })
      .then(data => {
        title.value = ''
        url_path.value = ''
        descr.value = ''
        rating.value = ''
        this.props.history.push('/')
        this.context.addBookmark(data)
      })
      .catch(error => {
        this.setState({ error })
      })
  }
  handleClickCancel = () => {
        this.props.history.push('/')
      };

  render() {
    const { error } = this.state
    return (
      <section className='AddBookmark'>
        <h2>Create a bookmark</h2>
        <form
          className='AddBookmark__form'
          onSubmit={this.handleSubmit}
        >
          <div className='AddBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor='title'>
              Title
              {' '}
              <Required />
            </label>
            <input
              type='text'
              name='title'
              id='title'
              placeholder='Great website!'
              required
            />
          </div>
          <div>
            <label htmlFor='url_path'>
              url_path
              {' '}
              <Required />
            </label>
            <input
              type='url_path'
              name='url_path'
              id='url_path'
              placeholder='https://www.great-website.com/'
              required
            />
          </div>
          <div>
            <label htmlFor='descr'>
              description
            </label>
            <textarea
              name='descr'
              id='descr'
            />
          </div>
          <div>
            <label htmlFor='rating'>
              Rating
              {' '}
              <Required />
            </label>
            <input
              type='number'
              name='rating'
              id='rating'
              defaultValue='1'
              min='1'
              max='5'
              required
            />
          </div>
          <div className='AddBookmark__buttons'>
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
    );
  }
}


AddBookmark.defaultProps = {
  title: "",
  url_path: "",
  rating: 1,
  descr: ""
};


export default AddBookmark;
