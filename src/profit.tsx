import * as React from 'react'
import Grid from '@material-ui/core/Grid';
import { TextField, Button } from '@material-ui/core';
import {
    DatePicker,
    MuiPickersUtilsProvider,
  } from "material-ui-pickers";
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import {EMPTY, zip} from 'rxjs';
import Axios from 'axios-observable';

import {isNotNumber, formatter} from './utils'

import './profile.css';

type ProfitState = {
    onDate: moment.Moment;
    amount: number;
    result?: number | null;
    error? : string
}

type Props = {
    value: moment.Moment;
    amount: string;
}

export class Profit extends React.Component<any, ProfitState> {

    constructor(props: Props) {
        super(props);
        this.state = {
            onDate: moment(),
            amount: 100,
            result:null
        };
    }

    handleChange(e: React.BaseSyntheticEvent) {
        if(!isNotNumber(e.target.value )) this.setState({error: 'this is not number'})
        else this.setState({ amount: e.target.value });
    }

    handleDateChange(e: moment.Moment){
        this.setState({ onDate: e });
    }

    calculate(){
        const {onDate, amount} = this.state;
        const latestRate = Axios.get('https://api.exchangeratesapi.io/latest?base=USD&symbols=RUB');
        const onDateFunction = Axios.get(`https://api.exchangeratesapi.io/${onDate.format('YYYY-MM-DD')}?base=USD&symbols=RUB`);
        zip(latestRate, onDateFunction, (latest, onDate) => {
            const diff = (latest.data.rates.RUB - onDate.data.rates.RUB) * amount;

            if(diff > 0){
                return diff - diff * 0.05;
            } else {
                return diff;
            }
        }).subscribe(value => {
                this.setState({result: value});
                return EMPTY;
            }
        )
    }

    render() {
        const {amount, onDate, error, result} = this.state;
        return (
            <Grid
                container
                className="main"
                spacing={24}
                direction="column"
                justify="center"
                alignItems="center">
                <Grid item>
                <TextField
                    id="amount"
                    label="Amount"
                    value={amount}
                    onChange={(e) => this.handleChange(e)}
                    margin="normal"
                    />
                </Grid>
                <Grid item>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <DatePicker
                        label="Select date"
                        value={onDate}
                        onChange={(e) => this.handleDateChange(e)}
                        format="DD/MM/YYYY"
                        animateYearScrolling
                        />
                    </MuiPickersUtilsProvider>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={e => this.calculate()}>
                        Calculate
                    </Button>
                </Grid>
                {result&&
                    <Grid item>
                        <p>Result: </p>
                        <p>{formatter('RUB', result)}</p>
                    </Grid>
                }
                {error &&
                <Grid item >
                    <p>Error: </p>
                    <p>{error}</p>
                </Grid>
                }

            </Grid>
        )
    }

}

export default Profit;