import { useNow } from '../utils/useNow'
import { isPast, formatCountdown, formatTimeSince, formatDate, formatTime } from '../utils/dates'
import '../css/Event.css'

const Event = (props) => {
    const now = useNow()

    const past = isPast(props.date, now)

    return (
        <article className={`event-information${past ? ' event-past' : ''}`}>
            <img src={props.image} alt={props.title} />

            <span className='event-chip'>
                {past ? formatTimeSince(props.date, now) : formatCountdown(props.date, now)}
            </span>
            {past && <span className='event-passed-badge'>Event passed</span>}

            <div className='event-information-overlay'>
                <div className='text'>
                    <h3>{props.title}</h3>
                    {props.locationName && <p><i className="fa-solid fa-location-dot"></i> {props.locationName}</p>}
                    <p><i className="fa-regular fa-calendar"></i> {formatDate(props.date)} <br /> {formatTime(props.date)}</p>
                </div>
            </div>
        </article>
    )
}

export default Event
