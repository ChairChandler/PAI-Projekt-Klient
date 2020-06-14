import React from 'react';
import { Loader } from 'google-maps';
import './style.css';
import { TournamentInfo } from 'models/tournament';

interface Props {
    data: TournamentInfo
}

interface State {
    logos?: { id: number, data: string }[]
}

export default class InfoCard extends React.Component<Props, State> {
    componentWillMount = async () => {
        await this.componentWillReceiveProps(this.props)
    }

    componentWillReceiveProps = async (nextProps: Props) => {
        await Promise.all([this.initGoogleMap(nextProps), this.initLogos(nextProps)])
    }

    private initGoogleMap = async (props: Props) => {
        const center = {
            lat: props.data?.localization_lat ?? 0,
            lng: props.data?.localization_lng ?? 0
        }
        const mapInfo = { center, zoom: 8 }

        const loader = new Loader()
        const google = await loader.load()
        const mapElement = $(`#map`)[0]
        const map = new google.maps.Map(mapElement, mapInfo)
        new google.maps.Marker({ position: center, map })
    }

    private initLogos = async (props: Props) => {
        const data = await Promise.all(
            props.data.logos.map(({ id, data }) => {
                const array = (data["data"] as Array<number>)
                const dataUrl = new Buffer(array).toString('base64')
                console.log(dataUrl)
                return { id, data: dataUrl }
            })
        )
        console.log(data)
        const state = { ...this.state }
        state.logos = data
        this.setState(state)
    }

    render = () => {
        const participants_limit = this.props.data?.participants_limit ?? '∞'

        return <div className="container-context container-rows">
            <h1>{this.props.data?.tournament_name}</h1>

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

                <div id='map' />
            </div>

            {this.state?.logos.length > 0 &&
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