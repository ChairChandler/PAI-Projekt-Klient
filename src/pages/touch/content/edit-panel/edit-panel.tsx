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
}

export default class EditPanel extends React.Component<Props, State> {
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

    private onSubmit = async (event) => {
        event.preventDefault()

        const name = $('#name')
        const description = $('#description')
        const date = $('#date')
        const limit = $('#limit')
        const deadline = $('#deadline')

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
            payload.localization_lat = 0
            payload.localization_lng = 0
            payload.logos = []

            const { error } = await TournamentService.modifyOrCreateTournamentInfo(payload, this.props.action)
            if(error) {
                this.props.onError(error)
            } else {
                this.props.onSuccess()
            }
        }
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

/*
{this.state.logos?.length > 0 &&
                <h1>Sponsors</h1> &&
                <div id="tournament-container-logo" className="container-cols">
                    {
                        this.state.logos.map(({ id, data }) =>
                            <img className="tournament-logo" src={data} alt={`logo_${id}`}></img>)
                    }
                </div>
            }
            */