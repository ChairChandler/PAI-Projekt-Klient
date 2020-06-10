import React from 'react';
import './style.css';
import { TournamentInfo } from 'models/tournament'
import { Loader } from 'google-maps';


interface Props {
    data: TournamentInfo
    uniqueId
}

interface State {
    logos?: { id: number, data: string }[]
}

export default class CardView extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    componentDidMount = async () => {
        await Promise.all([this.initGoogleMap(), this.initLogos()])
    }

    private initGoogleMap = async () => {
        const center = {
            lat: this.props.data?.localization_lat ?? 0,
            lng: this.props.data?.localization_lng ?? 0
        }
        const mapInfo = { center, zoom: 8 }
        const mapElement = $(`#map`)[0]
        const google = await new Loader().load();
        const map = new google.maps.Map(mapElement, mapInfo);
        new google.maps.Marker({ position: center, map })
    }

    private initLogos = async () => {
        const data = this.props.data.logos?.map(({ id, data }) => {

            const buffer = Buffer.from(data["data"])
            const dataUrl = buffer.toString('utf-8')

            return { id, data: dataUrl }
        })

        const state = { ...this.state }
        state.logos = data
        this.state = state
    }

    render = () => {
        const participants_limit = this.props.data?.participants_limit ?? '∞'

        return <div className="container-rows"    >

            <p>{this.props.data?.description}</p>

            <div className="container-cols">
                <table>
                    <tbody>
                        <tr>
                            <th>Organizer</th>
                            <td>{this.props.data?.organizer}</td>
                        </tr>

                        <tr>
                            <th>Datetime</th>
                            <td>{this.props.data?.datetime}</td>
                        </tr>

                        <tr>
                            <th>Participants</th>
                            <td>{this.props.data?.current_contestants_amount}/{participants_limit}</td>
                        </tr>

                        <tr>
                            <th>Joining deadline</th>
                            <td>{this.props.data?.joining_deadline}</td>
                        </tr>
                    </tbody>
                </table>

                <div id="map" />
            </div>

            {this.state.logos?.length > 0 &&
                <h1>Sponsors</h1> &&
                <div id="tournament-container-logo" className="container-cols">
                    {
                        this.state.logos.map(({ id, data }) =>
                            <img className="tournament-logo" src={data} alt={`logo_${id}`}></img>)
                    }
                </div>
            }
        </div >
    }
}