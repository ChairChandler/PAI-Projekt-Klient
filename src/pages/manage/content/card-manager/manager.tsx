import React from 'react';
import Card from './card/card'
import { TournamentInfo } from 'models/tournament'
import CardView from './card/card-view/card-view'
import CardEdit from './card/card-edit/card-edit'

export type CardInfo = { data: TournamentInfo, show: boolean, virtualName?: string, action?: 'CREATE' | 'EDIT' }

interface Props {
    cards: CardInfo[]
    onHideCard: (id: number) => void
    onError: (err) => void
    onCardDataChange: (id: number, data: TournamentInfo) => void
    onDelete: (id: number) => void
}

export default class CardManager extends React.Component<Props, {}>{
    render = () => {
        return <>
            {
                this.props.cards.map((v, i) =>
                    <section key={i}>
                        <Card uniqueId={i} header={v.data.tournament_name ?? v.virtualName} show={v.show} onClickTitle={this.props.onHideCard}>
                            {
                                v.action ?
                                    <CardEdit
                                    action={v.action}
                                    uniqueId={i}
                                    data={v.data}
                                    onCancel={() => this.props.onDelete(i)}
                                    onError={this.props.onError}
                                    onSuccess={data => this.props.onCardDataChange(i, data)}
                                    />
                                    :
                                    <CardView
                                        data={v.data}
                                        uniqueId={i}
                                    />
                            }
                        </Card>
                    </section>
                )
            }
        </>
    }
}