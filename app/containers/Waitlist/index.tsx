import React, { Component } from 'react';
import axios from 'axios';
import publicIp from 'react-public-ip';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import StepCounter from '../../components/StepCounter/StepCounter';
import StepTitle from '../../components/StepTitle/StepTitle';
import './Waitlist.scss';
import 'react-dropdown/style.css';
import '../../components/Dropdown/Dropdown.scss';

class Waitlist extends Component<{

}, {
    ipAddress: string,
    waitlistForm: {
        firstName: string,
        email: string,
        communication: boolean,
        formBusy: boolean,
        formSuccess: boolean,
    },
}> {

    leadSource: string;
    method: string;
    form: React.RefObject<HTMLFormElement>

    constructor(props) {
        super(props);

        publicIp
            .v4()
            .then(ip => {
                this.setState({ ipAddress: ip });
            })
            .catch(error => {
                console.log(error);
            });

        this.leadSource = 'matchme_waitlist_desktop';
        this.method = 'waitlist';
        this.form = React.createRef();
        this.state = {
            ipAddress: '',
            waitlistForm: {
                firstName: '',
                email: '',
                communication: false,
                formBusy: false,
                formSuccess: false,
            },
        };
    }

    /**
     * Validate form inputs and enroll customer into waitlist
     *
     * @param event
     */
    handleWaitlistJoin = event => {
        event.preventDefault();

        if (!this.form.current?.checkValidity()) {
            this.form.current?.reportValidity();
            return;
        }

        this.handleInputChange('formBusy', true);
        this.joinWaitlist();
    };

    /**
     * Enroll customer into waitlist
     */
    joinWaitlist() {
        axios({
            method: 'post',
            url: `${process.env.ENDPOINT_URL + this.method}/`,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Headers': 'sentry-trace, baggage', },
            data: {
                ipAddress: this.state.ipAddress,
                signature: process.env.API_SIGNATURE,
                client_user: process.env.CLIENT_USER,
                firstName: this.state.waitlistForm.firstName,
                email: this.state.waitlistForm.email,
                optIn: this.state.waitlistForm.communication ? 'active' : 'Transactional',
                leadSource: this.leadSource,
            },
        })
            .then(() => {
                this.handleInputChange('formSuccess', true);
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                this.handleInputChange('formBusy', false);
            });
    }

    handleInputChange = (key, value) => {
        const { waitlistForm } = this.state;
        waitlistForm[key] = value;
        this.setState({ waitlistForm });
    };

    render() {
        const { firstName, email, communication, formBusy, formSuccess } = this.state.waitlistForm;

        if (formSuccess) {
            return (
                <div className="Waitlist">
                    <section className="Waitlist-Success">
                        <h2>You have successfully joined the waitlist!</h2>
                    </section>
                </div>
            );
        }

        return (
            <div className="Waitlist">
                <StepCounter stepLabel="Waitlist" />
                <StepTitle title="To join, please enter your full name and an email. Mobile is optional." />
                <section className="Form-Wrapper">
                    <form ref={this.form}>
                        <Input
                            label="First Name"
                            value={firstName}
                            handleInputChange={e => this.handleInputChange('firstName', e.target.value)}
                            required
                        />
                        <Input
                            label="Email Address"
                            value={email}
                            handleInputChange={e => this.handleInputChange('email', e.target.value)}
                            type="email"
                            required
                        />
                        <div className="Newsletter">
                            <input
                                type="checkbox"
                                id="communication"
                                name="communication"
                                checked={communication}
                                onChange={() => this.handleInputChange('communication', !communication)}
                                onKeyPress={() => this.handleInputChange('communication', !communication)}
                            />
                            <label htmlFor="communication">Yes, please send me deals and new products to my email</label>
                        </div>
                    </form>
                </section>
                <Button onClick={this.handleWaitlistJoin} disabled={formBusy}>{`${formBusy ? 'Joining...' : 'Join the Waitlist'}`}</Button>
            </div>
        );
    }
}

export default Waitlist;
