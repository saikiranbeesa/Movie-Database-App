import {Component} from 'react'

import Loader from 'react-loader-spinner'
import MovieCard from '../MovieCard'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const API_KEY = '9b5f0be98627628678783d2149fd5d5c'

class Home extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    movies: [],
    currentPage: 1,
  }

  componentDidMount() {
    this.getPopularMovies()
  }

  getPopularMovies = async () => {
    const {currentPage} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const getPopularMoviesURL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${currentPage}`
    const response = await fetch(getPopularMoviesURL)
    // console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      this.setState({
        movies: data.results,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onNextPage = () => {
    this.setState(
      prevState => ({currentPage: prevState.currentPage + 1}),
      this.getPopularMovies,
    )
  }

  onPrevPage = () => {
    this.setState(
      prevState => {
        if (prevState.currentPage > 1) {
          return {currentPage: prevState.currentPage - 1}
        }
        return null // prevents unnecessary re-render + fetch at page 1
      },
      () => {
        const {currentPage} = this.state
        if (currentPage > 0) {
          this.getPopularMovies()
        }
      },
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#3B82F6" height="50" width="50" />
    </div>
  )

  renderSuccessView = () => {
    const {movies, currentPage} = this.state
    // console.log(movies)
    return (
      <div className="home-container">
        <h1>Popular Movies</h1>
        <div className="movies-grid">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        <div className="pagination">
          <button
            type="button"
            onClick={this.onPrevPage}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <p className="page-number">{currentPage}</p>
          <button type="button" onClick={this.onNextPage}>
            Next
          </button>
        </div>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="error-view">
      <p>Something went wrong. Please try again.</p>
      <button type="button" onClick={this.getPopularMovies}>
        Retry
      </button>
    </div>
  )

  renderView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return <>{this.renderView()}</>
  }
}

export default Home
