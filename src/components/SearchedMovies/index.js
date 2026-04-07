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

class SearchedMovies extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    movies: [],
  }

  componentDidMount() {
    this.getSearchedMovies()
  }

  componentDidUpdate(prevProps) {
    const {match} = this.props
    if (prevProps.match.params.query !== match.params.query) {
      this.getSearchedMovies()
    }
  }

  getSearchedMovies = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {query} = match.params
    const API_KEY = '9b5f0be98627628678783d2149fd5d5c'
    const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${query}&page=1`
    const response = await fetch(apiUrl)
    if (response.ok === true) {
      const data = await response.json()
      if (data && data.results) {
        this.setState({
          movies: data.results,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#3B82F6" height="50" width="50" />
    </div>
  )

  renderSuccessView = () => {
    const {movies} = this.state
    return (
      <div className="home-container">
        <h1>Searched Movies</h1>
        <div className="movies-grid">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    )
  }

  renderView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      default:
        return null
    }
  }

  render() {
    return <>{this.renderView()}</>
  }
}

export default SearchedMovies
