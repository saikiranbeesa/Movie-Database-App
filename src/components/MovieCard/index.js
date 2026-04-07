import {Component} from 'react'
import {withRouter} from 'react-router-dom'
import './index.css'

class MovieCard extends Component {
  onClickDetails = () => {
    const {movie, history} = this.props
    history.push(`/movies/${movie.id}`)
  }

  render() {
    const {movie} = this.props
    const imageUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
      : 'https://via.placeholder.com/200x300?text=No+Image'

    return (
      <div className="movie-card">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={movie.title}
            className="movie-poster"
            onError={e => {
              e.target.src = '/no-image.png'
            }}
          />
        )}
        <div className="movie-info">
          <h3 className="movie-title">{movie.title}</h3>
          <p>
            <strong>Rating: </strong>
            {movie.vote_average}
          </p>
          <button
            type="button"
            className="details-button"
            onClick={this.onClickDetails}
          >
            View Details
          </button>
        </div>
      </div>
    )
  }
}

export default withRouter(MovieCard)
