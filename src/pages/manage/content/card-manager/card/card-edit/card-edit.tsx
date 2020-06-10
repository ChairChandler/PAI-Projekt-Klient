import React from 'react';
import { TournamentInfo } from 'models/tournament'
import { Loader } from 'google-maps';
import validationInfo from 'config/validation.json';
import server_info from 'config/server.json'
import * as vld from 'validation/tournament'
import './style.css';


interface Props {
    data: TournamentInfo
    uniqueId
    onCancel: () => void
    onSuccess: (data: TournamentInfo) => void
    onError: (err) => void
    action: 'CREATE' | 'EDIT'
}

interface State {
    logos?: { id: number, data: string }[]
}

export default class CardEdit extends React.Component<Props, State> {
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
        event.preventDefault();

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

            await this.sendTournamentInfo(payload, this.props.action)
        }
    }

    private sendTournamentInfo = async (payload: TournamentInfo, action: 'CREATE' | 'EDIT') => {
        try {
            const data = await fetch(`http://${server_info.ip}:${server_info.port}/tournament/info`, {
                method: action === 'CREATE' ? 'POST' : 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!data.ok) {
                throw Error(await data.text())
            }

            this.props.onSuccess(payload)
        } catch (err) {
            this.props.onError(err)
        }
    }

    render = () => {
        return <form className="container-rows" onSubmit={this.onSubmit}>
            <div className="form-group">
                <label className="form-check-label">Tournament name</label>
                <input
                    type="text"
                    className="form-control"
                    id="name"
                    min={validationInfo.tournament_name.min}
                    max={validationInfo.tournament_name.max}
                    value={this.props.data.tournament_name}
                />
                <small>Text have to be {validationInfo.tournament_name.min}-{validationInfo.tournament_name.max} characters long.</small>
            </div>

            <div className="form-group">
                <label className="form-check-label">Description</label>
                <input
                    type="text"
                    className="form-control"
                    id="description"
                    max={validationInfo.description.max}
                    value={this.props.data.description}
                />
                <small>Description have to be max {validationInfo.description.max} characters long.</small>
            </div>

            <div className="form-group">
                <label className="form-check-label">Date</label>
                <input
                    type="date"
                    className="form-control"
                    id="date"
                    min={new Date().toString()}
                    value={this.props.data.datetime?.toString()}
                />
            </div>

            <div className="form-group">
                <label className="form-check-label">Paritcipants limit</label>
                <input
                    type="number"
                    className="form-control"
                    id="limit"
                    min={this.props.data.current_contestants_amount ?? validationInfo.participants_limit.min}
                    value={this.props.data.participants_limit}
                />

                <label className="form-check-label">∞</label>
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
                    min={new Date().toString()}
                    value={this.props.data.joining_deadline?.toString()}
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