import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from 'actions'
import ItemsList from 'components/dashboard/containers/ItemsList'
import { TableHead, TableRow, TableCell } from 'react-toolbox/lib/table'
import Rows from 'components/dashboard/collection/Rows'
import theme from './theme.css'
import Translate from 'components/translate/Translate'
import { IconButton, Button } from 'react-toolbox/lib/button'
import Dialog from 'react-toolbox/lib/dialog'
import BidsGenerator from 'helpers/dev/InkBidsStatsGenerator'
import { BidsStatisticsChart } from './bidsStatistics'
import NewBidSteps from './NewBidSteps'
import NewItemWithDialog from 'components/dashboard/forms/NewItemWithDialog'
import * as sc from 'services/smart-contracts/ADX'

const BidFormWithDialog = NewItemWithDialog(NewBidSteps)

const VIEW_MODE = 'auctionRowsView'
const AVAILABLE_SLOTS = 2000000

// Can be changed. The ad unit representing the eJ advertising space
const MAGIC_ADUNIT = 2

const SORT_PROPERTIES = [
    // { value: 'price', label: 'Price' },
    // { value: 'count', label: 'Count' },
    // { value: 'wonNumber', label: 'Won number' },
    // { value: 'wonPriceTotal', label: 'Won Price Total' }
]

const searchMatch = (bid) => {
    return ((bid.id + '') || '') +
        ((bid.name + '') || '') +
        ((bid.price + '') || '') +
        ((bid.count + '') || '') +
        ((bid.wonNumber + '') || '')
}

let BID_MODEL = {
    id: 0,
    name: 'Advertiser name',
    count: 100, // Slots(boarding passes)
    price: 5, // in USD cents
    total: 500, // in USD cents - for sorting purpose 
    wonNumber: 500,
    wonPriceTotal: 500, // in USD cents - for sorting purpose 
    execution: ''
}

export class Auction extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            bidding: false,
            bid: {},
            bids: this.mapBids(BidsGenerator.getSomeRandomBids())
        }
    }

    componentWillMount() {
        // TODO: add persisted account to web3.eth.accounts
        console.log(sc.web3.eth.accounts.wallet)

        sc.token.methods.balanceOf('0xd874b82fd6a1c8bc0911bd025ae7ab2ca448740f')
            .call()
            .then(function (bal) {
                console.log('bal', bal)
            })
    }

    mapBids(bids) {
        return bids
            .sort((a, b) => {
                if (a.adUnitIpfs < b.adUnitIpfs) {
                    return 1
                } else if (a.adUnitIpfs > b.adUnitIpfs) {
                    return -1
                } else {
                    if (a.requiredPoints < b.requiredPoints) {
                        return 1
                    } else if (a.requiredPoints > b.requiredPoints) {
                        return -1
                    } else {
                        if (a.id < b.id) {
                            return -1
                        } else if (a.id > b.id) {
                            return 1
                        } else {
                            return 0
                        }
                    }
                }
            })
            .reduce((memo, bid, index) => {
                let usedSlots = memo.usedSlots
                let leftSlots = AVAILABLE_SLOTS - usedSlots
                let wonNumber = bid.requiredPoints
                let execution = 'full'
                let bids = memo.bids

                if (leftSlots <= 0) {
                    execution = 'none'
                } else if ((leftSlots - wonNumber) < 0) {
                    wonNumber = leftSlots
                    execution = 'partial'
                }

                usedSlots = usedSlots + wonNumber

                let mappedBid = {
                    id: bid.id,
                    name: bid.id,
                    price: bid.adUnitIpfs,
                    count: bid.requiredPoints,
                    total: bid.adUnitIpfs * bid.requiredPoints,
                    wonNumber: wonNumber,
                    wonPriceTotal: wonNumber * bid.adUnitIpfs,
                    execution: execution
                }

                bids.push(mappedBid)

                return {
                    bids: bids,
                    usedSlots: usedSlots
                }

            }, { bids: [], usedSlots: 0 })
            .bids
    }

    renderTableHead() {
        return (
            <TableHead>
                <TableCell> {this.props.t('NAME')} </TableCell>
                <TableCell> {this.props.t('PRICE')} </TableCell>
                <TableCell> {this.props.t('COUNT')} </TableCell>
                <TableCell> {this.props.t('TOTAL')} </TableCell>
                <TableCell> {this.props.t('WON_NUMBER')} </TableCell>
                <TableCell> {this.props.t('WON_TOTAL_PRICE')} </TableCell>
                <TableCell> {this.props.t('EXECUTION')} </TableCell>
            </TableHead>
        )
    }

    renderTableRow(item, index, { to, selected }) {
        return (
            <TableRow key={item.id}>
                <TableCell> {item.name} </TableCell>
                <TableCell> {(item.price / 100) + ' $'} </TableCell>
                <TableCell> {item.count} </TableCell>
                <TableCell> {((item.price * item.count) / 100) + ' $'} </TableCell>
                <TableCell> {item.wonNumber} </TableCell>
                <TableCell> {item.wonPriceTotal} </TableCell>
                <TableCell> {item.execution} </TableCell>
            </TableRow >
        )
    }

    renderRows = (items) =>
        <Rows
            multiSelectable={false}
            selectable={false}
            side={this.props.side}
            item={items}
            rows={items}
            rowRenderer={this.renderTableRow.bind(this)}
            tableHeadRenderer={this.renderTableHead.bind(this)}
        />

    bid = (slot, active) => {
        this.setState({ bid: slot, bidding: active })
    }

    render() {
        return (
            <div>

                <h1> EJ auction </h1>
                <div>
                    <BidFormWithDialog
                        btnLabel='PLACE_BID'
                        title={this.props.t('PLACE_BID_FOR', { args: ['EJ'] })}
                        accent
                        raised
                        bidId='EJBID'
                    />
                </div>
                <div>
                    <BidsStatisticsChart data={this.state.bids} t={this.props.t} />
                </div>
                <ItemsList
                    items={this.state.bids}
                    listMode='rows'
                    renderRows={this.renderRows.bind(this)}
                    sortProperties={SORT_PROPERTIES}
                    searchMatch={searchMatch}
                    rowsView={VIEW_MODE}
                />
            </div>
        )
    }
}

Auction.propTypes = {
    actions: PropTypes.object.isRequired,
    account: PropTypes.object.isRequired,
    rowsView: PropTypes.bool.isRequired
}

function mapStateToProps(state) {
    let persist = state.persist
    // let memory = state.memory
    return {
        account: persist.account,
        rowsView: !!persist.ui[VIEW_MODE]
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Translate(Auction))
