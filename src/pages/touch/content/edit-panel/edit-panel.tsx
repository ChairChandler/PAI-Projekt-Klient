import React from 'react';
import { TournamentInfo } from 'models/tournament'
import { Loader } from 'google-maps';
import validationInfo from 'config/validation.json';
import * as vld from 'validation/tournament'
import { getOnlyDateString, oneDayAfterNowDate } from 'utils/date'
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
    logos: { id?: number, data?: Blob, text: string }[]
    marker?: google.maps.Marker
    inputsValidation: {
        name?: boolean
        description?: boolean
        tournament_date?: boolean
        joining_deadline?: boolean
    }
}

export default class EditPanel extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { inputsValidation: {}, logos: [] }
    }

    componentDidMount = async () => {
        const [marker, logos] = await Promise.all([this.initGoogleMap(), this.initLogos()])
        this.setState({ ...this.state, marker, logos })
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

    private initLogos = async (): Promise<{ id: number, data: Blob, text: string }[]> => {
        const data = this.props.data.logos?.map(({ id, data }) => {

            const buffer = Buffer.from(data["data"])
            const dataUrl = buffer.toString('utf-8')

            return { id, data: data["data"], text: dataUrl }
        }) ?? []

        return data
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
        const limitVal = limit.val() as string
        const deadlineVal = new Date(deadline.val() as string)


        const ok = [
            this.changeValidationInfo(vld.validateName(nameVal), name, 'name'),
            this.changeValidationInfo(vld.validateDescription(descriptionVal), description, 'description'),
            this.changeValidationInfo(vld.validateDatetime(dateVal, deadlineVal), date, 'tournament_date'),
            this.changeValidationInfo(vld.validateJoiningDeadline(deadlineVal, dateVal), deadline, 'joining_deadline'),
        ].every(Boolean)


        if (ok) {
            const payload = new TournamentInfo()
            payload.tournament_id = this.props.data.tournament_id
            payload.tournament_name = nameVal
            payload.description = descriptionVal
            payload.datetime = dateVal
            payload.joining_deadline = deadlineVal
            payload.participants_limit = limitVal.length > 0 ? Number.parseInt(limitVal) : null
            payload.localization_lat = position.lat
            payload.localization_lng = position.lng

            if (this.state.logos) {
                payload.logos = await Promise.all(this.state.logos.map(
                    ({ id, data }) => {
                        if (this.props.action === 'CREATE') {
                            return { data }
                        } else {
                            return { id, data }
                        }
                    }))
            } else {
                payload.logos = []
            }

            const { error } = await TournamentService.modifyOrCreateTournamentInfo(payload, this.props.action)
            if (error) {
                this.props.onError(error)
            } else {
                this.props.onSuccess()
            }
        }
    }

    private changeValidationInfo = (validated: boolean, input: JQuery<HTMLElement>, field: string) => {
        const state = { ...this.state }
        state.inputsValidation[field] = validated
        this.setState(state)

        if (validated) {
            input.removeClass('is-invalid');
            input.addClass('is-valid');
        } else {
            input.removeClass('is-valid');
            input.addClass('is-invalid');
        }

        return validated
    }

    private addLogo = (files: FileList) => {
        const reader = new FileReader()
        const blob = files[0]

        reader.addEventListener('load', ev => {
            this.state.logos.push({ data: blob, text: ev.target.result as string })
            this.forceUpdate()
        })

        reader.readAsDataURL(blob)
    }

    private removeLogo = (index: number) => {
        if (this.props.action === 'EDIT' && this.state.logos[index].id) {
            this.setState(state => {
                state.logos[index].data = null
                return state
            })
        } else {
            delete this.state.logos[index]
            this.forceUpdate()
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
                    maxLength={validationInfo.tournament_name.max}
                    defaultValue={this.props.data.tournament_name}
                    autoComplete="off"
                />
                <small>Text have to be {validationInfo.tournament_name.min}-{validationInfo.tournament_name.max} characters long.</small>
                {
                    !this.state.inputsValidation.name &&
                    <div className="invalid-feedback">Wrong tournament name</div>
                }
            </div>

            <div className="form-group">
                <label className="form-check-label">Description</label>
                <textarea
                    className="form-control"
                    id="description"
                    maxLength={validationInfo.description.max}
                    defaultValue={this.props.data.description}
                    autoComplete="off"
                />
                <small>Description have to be max {validationInfo.description.max} characters long.</small>
                {
                    !this.state.inputsValidation.description &&
                    <div className="invalid-feedback">Wrong description</div>
                }
            </div>

            <div className="form-group">
                <label className="form-check-label">Date</label>
                <input
                    type="date"
                    className="form-control"
                    id="date"
                    min={getOnlyDateString(oneDayAfterNowDate())}
                    defaultValue={this.props.data.datetime ? getOnlyDateString(new Date(this.props.data.datetime)) : null}
                />
                <small>Tournament date have to be minimum 1 day later than joining deadline.</small>
                {
                    !this.state.inputsValidation.tournament_date &&
                    <div className="invalid-feedback">Wrong date</div>
                }
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
                <label className="form-check-label">Joining deadline</label>
                <input
                    type="date"
                    className="form-control"
                    id="deadline"
                    min={getOnlyDateString(oneDayAfterNowDate())}
                    defaultValue={this.props.data.joining_deadline ? getOnlyDateString(new Date(this.props.data.joining_deadline)) : null}
                />
                <small>Joining deadline have to be minimum 1 day before tournament date.</small>
                {
                    !this.state.inputsValidation.joining_deadline &&
                    <div className="invalid-feedback">Wrong joining deadline</div>
                }
            </div>

            <div className="form-group">
                <label className="form-check-label">Location</label>
                <div id="map" />
            </div>

            <div className="flex">
                <h2>Sponsors Logo</h2>
                <div className="form-group">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(ev) => {
                            if (ev.target.files.length) {
                                this.addLogo(ev.target.files)
                            }
                        }}
                    />
                </div>
            </div>

            {this.state.logos.length > 0 &&
                <div id="tournament-container-logo" className="container-cols">
                    {
                        this.state.logos.map(({ text }, index) =>
                            <span className="tournament-logo">
                                <div id={`logo-cross-remove-${index}`} onClick={() => this.removeLogo(index)}>
                                    &times;
                                </div>
                                <img style={{ "maxWidth": "100%" }} src={text} alt={`logo_${index}`}></img>
                            </span>)
                    }
                </div>
            }

            <div className="flex" style={{ marginTop: '20px' }}>
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