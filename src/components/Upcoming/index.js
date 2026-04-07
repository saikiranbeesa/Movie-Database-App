import {Component} from 'react'
import Loader from 'react-loader-spinner'
import MovieCard from '../MovieCard'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Upcoming extends Component {
  state = {
    movies: [],
    apiStatus: apiStatusConstants.initial,
    currentPage: 1,
  }

  componentDidMount() {
    this.getUpcomingMovies()
  }

  getUpcomingMovies = async () => {
    const {currentPage} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const API_KEY = '9b5f0be98627628678783d2149fd5d5c'
    const apiUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${currentPage}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
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
      this.getUpcomingMovies,
    )
  }

  onPrevPage = () => {
    this.setState(
      prevState => {
        // Only decrement if currentPage > 1
        if (prevState.currentPage > 1) {
          return {currentPage: prevState.currentPage - 1}
        }
        return null // No state change if already on page 1
      },
      () => {
        // Call API only if currentPage changed
        const {currentPage} = this.state
        if (currentPage > 0) {
          this.getUpcomingMovies()
        }
      },
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#3B82F6" height="50" width="50" />
    </div>
  )

  renderSuccess = () => {
    const {movies, currentPage} = this.state

    return (
      <div className="home-container">
        <h1>Upcoming Movies</h1>
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
      <button type="button" onClick={this.getUpcomingMovies}>
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
        return this.renderSuccess()
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

export default Upcoming
