import React, { Component } from 'react';
import axios from 'axios';
import './ui-toolkit/css/nm-cx/main.css';
//import logo from './logo.svg';
//  use it {logo}
import './App.css';

const gitHubScoreMessage = score => {
  score = parseInt(score, 10);
  switch(true) {
    case score >= 200:
      return {color: "blue", message: "GitHub Elite!"};
    case score < 200 && score >= 100:
      return {color: "green", message: "Great Job!"};
    case score < 100 && score >= 50:
      return {color: "black", message: "Doing Good!"};
    case score < 50 && score >= 20:
      return {color: "orange", message: "A Decent Start!"};
    case score < 20:
      return {color: "red", message: "Needs Work!"};
    default:
      return {color: "purple", message: "Nothing to say right now"};
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      humorQuote: '',
      username: '',
      result: '',
      error: ''
    }
  }

  componentDidMount() {
    axios.get('https://ron-swanson-quotes.herokuapp.com/v2/quotes')
      .then(response => {
        this.setState({humorQuote: response.data});
      })
      .catch(error => {
        console.log(error);
      });

      this.handleInput = this.handleInput.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.getGitHubInfo = this.getGitHubInfo.bind(this);
  }

  handleInput(e) {
    this.setState( {username: e.target.value.trim(), error: ''} );
  }

  handleSubmit(e) {
    e.preventDefault();
    this.getGitHubInfo(this.state.username);
  }


  getGitHubInfo(username) {
    axios.get(`https://api.github.com/users/${username}`)
      .then( response => {
        console.log("Getting GitHub Information...")
        const {data} = response;
        console.log(data);
        this.setState( {result: {login: data.login, name: data.name, avatar: data.avatar_url, score: (data.public_repos + data.followers), memberSince: data.created_at.split('-')[0]} });
      })
      .catch( error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          //  console.log(error.response.data.message);
          //  console.log(error.response.status);
          //  console.log(error.response.headers);
          this.setState( {error: `The user, ${this.state.username}, you are attempting to search for is not found.  Error message: ${error.response.data.message}`})
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      });
  }

  render() {
    return (
      <div className="App">

        <header>
          <h1 className="margin-vert-xlarge padding-vert-large padding-horiz-xlarge">GitHub Score</h1>
        </header>

        {/* -- OVERALL GITHUB SCORE COMPONENT -- */}
        <div className="row">

          {/* -- Search for GitHub User -- */}
          <div className="xlarge-5 large-6 medium-6 small-12 columns">

            <form onSubmit={this.handleSubmit}>

              <div className="row">
                <div className="small-12 medium-6 large-6 columns md-text-field with-floating-label">
                  <input
                    id="gitHubId"
                    type="text"
                    value={this.state.username}
                    onInput={this.handleInput}
                    required
                  />
                  <label htmlFor="gitHubId">GitHub Username</label>
                  <span className="error block padding-top-small padding-bottom-small" style={ {wordWrap: 'break-word'} }>{this.state.error}</span>
                </div>

                <div className="small-12 medium-6 large-4 end columns">
                  <button
                    className="button btn-cta success expand"
                    onClick={this.handleSubmit}
                    type="submit"
                    disabled={this.state.username.trim() === '' ? true : false}
                  >Calculate GitHub Score</button>
                </div>
              </div>

            </form>

          </div>

          {/* -- GitHub Score Results -- */}
          <div className="xlarge-7 large-6 medium-6 small-12 end columns" style={ this.state.error.trim() === '' && this.state.result !== '' ? {visibility: "visible"} : {visibility: "hidden"} }>
            <div className="card">

              <div className="row">
                <div className="xlarge-6 large-6 medium-6 small-12 columns">
                  <h3><b>Your Score</b></h3>
                  <h1 className="text-center">{this.state.result.score}</h1>
                  <h3 className="text-center" style={ {color: gitHubScoreMessage(this.state.result.score).color} }>{gitHubScoreMessage(this.state.result.score).message}</h3>
                </div>
                <div className="xlarge-6 large-6 medium-6 small-12 columns">
                  <img
                    src={this.state.result.avatar}
                    alt={`${this.state.result.name} | ${this.state.result.login}'s Avatar`}
                    className="avatar"
                    style={ {border: `3px solid ${gitHubScoreMessage(this.state.result.score).color}`}}
                  />
                </div>
              </div>

              <div className="row"><hr /></div>

              <div className="row collapse">
                <div className="small-4 columns">
                  <p><b>Name:</b></p>
                </div>
                <div className="small-8 columns">
                  <p>{this.state.result.name}</p>
                </div>
              </div>
              <div className="row collapse">
                <div className="small-4 columns">
                  <p><b>Login:</b></p>
                </div>
                <div className="small-8 columns">
                  <p>{this.state.result.login}</p>
                </div>
              </div>
              <div className="row collapse">
                <div className="small-4 columns">
                  <p><b>Member Since:</b></p>
                </div>
                <div className="small-8 columns">
                  <p>{this.state.result.memberSince}</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        <footer className="row padding-small">
          <div className="small-2 columns valign-middle">
            <p>Advice from <b>Ron Swanson</b></p>
          </div>
          <div className="small-10 columns text-center valign-middle inline-block height-full">
            <p><i><b>"</b>{this.state.humorQuote}<b>"</b></i></p>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
