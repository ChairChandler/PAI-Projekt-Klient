import React from 'react';
import { TournamentInfo } from 'models/tournament'
import { Loader } from 'google-maps';
import validationInfo from 'config/validation.json';
import * as vld from 'validation/tournament'
import { getOnlyDateString } from 'utils/date'
import TournamentService from 'services/tournament/tournament'
import './style.css';


interface Props {
    data: TournamentInfo
    onCancel?: () => void
    onSuccess?: () => void
    onError?: (err: string) => void
    action: 'CREATE' | 'EDIT'
}

interface State {
    logos?: { id: number, data: string }[]
    marker?: google.maps.Marker
}

export default class EditPanel extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    componentDidMount = async () => {
        const [marker, logos] = await Promise.all([this.initGoogleMap(), this.initLogos()])
        this.setState({ marker, logos })
    }

    private initGoogleMap = async (): Promise<google.maps.Marker> => {
        const center = {
            lat: this.props.data?.localization_lat ?? 0,
            lng: this.props.data?.localization_lng ?? 0
        }
        const mapInfo = { center, zoom: 8 }
        const mapElement = $(`#map`)[0]
        const google = await new Loader().load();
        const map = new google.maps.Map(mapElement, mapInfo);
        const marker = new google.maps.Marker({ position: center, map, draggable: true })

        return marker
    }

    private initLogos = async (): Promise<{ id: number, data: string }[]> => {
        const data = this.props.data.logos?.map(({ id, data }) => {

            const buffer = Buffer.from(data["data"])
            const dataUrl = buffer.toString('utf-8')

            return { id, data: dataUrl }
        })

        return data
    }

    componentDidUpdate = () => {
        // set cross position to img position, 10% of img width, height
        const factor = 0.1
        
        this.state.logos?.forEach(({id}) => {
            const cross = $(`logo-cross-remove-${id}`)
            const img = cross.next('img')
            const { left, top } = img.position()
            const [width, height] = [factor * img.width(), factor * img.height()]

            cross.css({left, top, width, height})
        })
    }

    private onSubmit = async (event) => {
        event.preventDefault()

        const name = $('#name')
        const description = $('#description')
        const date = $('#date')
        const limit = $('#limit')
        const deadline = $('#deadline')
        const position = this.state.marker.getPosition().toJSON()

        const nameVal = name.val() as string
        const descriptionVal = description.val() as string
        const dateVal = new Date(date.val() as string)
        const infinityVal = $('#infinity').is(':checked')
        const limitVal = infinityVal ? null : limit.val() as number
        const deadlineVal = new Date(deadline.val() as string)


        const ok = [
            vld.validateName(nameVal),
            vld.validateDescription(descriptionVal),
            vld.validateDatetime(dateVal),
            vld.validateJoiningDeadline(deadlineVal, dateVal),
            vld.validateParticipantsLimit(this.props.data.current_contestants_amount, limitVal)
        ].every(Boolean)

        if (ok) {
            const payload = new TournamentInfo()
            payload.tournament_name = nameVal
            payload.description = descriptionVal
            payload.datetime = dateVal
            payload.joining_deadline = deadlineVal
            payload.participants_limit = limitVal
            payload.localization_lat = position.lat
            payload.localization_lng = position.lng
            payload.logos = await Promise.all(this.state.logos.map(
                ({ id, data }) => ({ id, data: new Blob([data], { type: 'contentType' }) })))

            const { error } = await TournamentService.modifyOrCreateTournamentInfo(payload, this.props.action)
            if (error) {
                this.props.onError(error)
            } else {
                this.props.onSuccess()
            }
        }
    }

    private removeLogo = (id: number) => {
        const index = this.state.logos.findIndex(v => v.id === id)
        this.state.logos.splice(index)
        this.setState(this.state)
    }

    render = () => {
        return <form className="container-context container-rows" onSubmit={this.onSubmit}>
            <div className="form-group">
                <label className="form-check-label">Tournament name</label>
                <input
                    type="text"
                    className="form-control"
                    id="name"
                    minLength={validationInfo.tournament_name.min}
                    maxLength={validationInfo.tournament_name.max}
                    defaultValue={this.props.data.tournament_name}
                />
                <small>Text have to be {validationInfo.tournament_name.min}-{validationInfo.tournament_name.max} characters long.</small>
            </div>

            <div className="form-group">
                <label className="form-check-label">Description</label>
                <textarea
                    className="form-control"
                    id="description"
                    maxLength={validationInfo.description.max}
                    defaultValue={this.props.data.description}
                />
                <small>Description have to be max {validationInfo.description.max} characters long.</small>
            </div>

            <div className="form-group">
                <label className="form-check-label">Date</label>
                <input
                    type="date"
                    className="form-control"
                    id="date"
                    min={getOnlyDateString(new Date())}
                    defaultValue={this.props.data.datetime ? getOnlyDateString(this.props.data.datetime) : null}
                />
            </div>

            <div className="form-group">
                <label className="form-check-label">Paritcipants limit</label>
                <input
                    type="number"
                    className="form-control"
                    id="limit"
                    min={this.props.data.current_contestants_amount ?? validationInfo.participants_limit.min}
                    defaultValue={this.props.data.participants_limit}
                />
            </div>

            <div className="form-group">
                <label>Infinity</label>
                <input
                    type="checkbox"
                    id="infinity"
                />
            </div>

            <div className="form-group">
                <label className="form-check-label">Joining deadline</label>
                <input
                    type="date"
                    className="form-control"
                    id="deadline"
                    min={getOnlyDateString(new Date())}
                    defaultValue={this.props.data.joining_deadline ? getOnlyDateString(this.props.data.joining_deadline) : null}
                />
            </div>

            <div id="map" />

            {this.state.logos?.length > 0 &&
                <h1>Sponsors</h1> &&
                <div id="tournament-container-logo" className="container-cols">
                    {
                        this.state.logos.map(({ id, data }) =>
                            <>
                                <div id={`logo-cross-remove-${id}`} onClick={() => this.removeLogo(id)}>
                                    &times;
                                </div>
                                <img className="tournament-logo" src={data} alt={`logo_${id}`} />
                            </>)
                    }
                </div>
            }

            <div className="flex">
                <input
                    type="submit"
                    className="btn btn-primary"
                    value="OK"
                    id="submit"
                />

                <input
                    type="button"
                    className="btn btn-secondary"
                    value="Cancel"
                    onClick={this.props.onCancel}
                />
            </div>
        </form>
    }
}