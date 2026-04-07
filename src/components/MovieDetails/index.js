import {Component} from 'react'
import Loader from 'react-loader-spinner'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class MovieDetails extends Component {
  state = {
    movieDetails: null,
    castDetails: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getMovieData()
  }

  getMovieData = async () => {
    const {match} = this.props
    const {id} = match.params

    this.setState({apiStatus: apiStatusConstants.inProgress})
    const API_KEY = '9b5f0be98627628678783d2149fd5d5c'
    const movieUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`
    const options = {
      method: 'GET',
    }
    const movieResponse = await fetch(movieUrl, options)
    if (movieResponse.ok === true) {
      const movieData = await movieResponse.json()
      console.log(movieData)
      // castDetails
      const castUrl = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}&language=en-US`
      const castResponse = await fetch(castUrl)
      console.log(castResponse)
      if (castResponse.ok === true) {
        const castData = await castResponse.json()
        this.setState({
          movieDetails: movieData,
          castDetails: castData.cast,
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

  renderSuccess = () => {
    const {movieDetails, castDetails} = this.state
    const posterUrl = `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`

    return (
      <div className="movie-details-container">
        <div className="movie-info">
          <img
            src={posterUrl}
            alt={movieDetails.title}
            className="movie-image"
          />
          <div className="movie-text">
            <h2>{movieDetails.title}</h2>
            <p>
              <strong>Rating: </strong>
              {movieDetails.vote_average}
            </p>
            <p>
              <strong>Duration: </strong>
              {movieDetails.runtime}
            </p>
            <p>
              <strong>Genre: </strong>
              {movieDetails.genres.map(g => g.name).join(', ')}
            </p>
            <p>
              <strong>Release Date: </strong>
              {movieDetails.release_date}
            </p>
            <p>
              <strong>Overview: </strong>
              {movieDetails.overview}
            </p>
          </div>
        </div>

        {/* Cast */}
        <h3>Cast</h3>
        <div className="cast-grid">
          {castDetails.map(cast => {
            const castImg = cast.profile_path
              ? `https://image.tmdb.org/t/p/w200${cast.profile_path}`
              : 'https://via.placeholder.com/200x300?text=No+Image'

            return (
              <div className="cast-card" key={cast.cast_id}>
                <img src={castImg} alt={cast.name} className="cast-img" />
                <p className="cast-name">{cast.name}</p>
                <p className="cast-character">{cast.character}</p>
              </div>
            )
          })}
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
        return this.renderSuccess()
      default:
        return null
    }
  }

  render() {
    return <>{this.renderView()}</>
  }
}

export default MovieDetails
