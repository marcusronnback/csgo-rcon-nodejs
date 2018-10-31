import {h, Component, render} from 'preact';
import Router from 'preact-router';
import mitt from 'mitt';
import Socket from './modules/socket';

import Header from "./components/Header";
import Home from './components/Home';
import Create from './components/Create';
import Detail from './components/Detail';
import Settings from './components/Settings';

import Notification from './components/Notification';

class App extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            connected: false,
            reconnecting: false
        };

        Socket.initialize(window.location.host, () => this.connected(), () => this.disconnected() , () => this.reconnecting());
        window.events = mitt();
    }

    /**
     * Function when socket connects
     */
    connected() {
        this.setState({
            connected: true,
            reconnecting: false
        });
    }

    /**
     * Function when socket disconnects
     */
    disconnected() {
        this.setState({
            connected: false,
            reconnecting: false
        });
    }

    /**
     * Function when the socket is reconnecting
     */
    reconnecting() {
        this.setState({
            reconnecting: true
        });
    }

    /**
     * Catches the router events
     *
     * @param e
     */
    routerUpdate(e) {
        window.events.emit("router", {
            route: e.url
        });
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div id="root">
                <Header connected={this.state.connected} reconnecting={this.state.reconnecting}/>
                <div className="container">
                    <Notification/>
                    {this.state.connected && this.mainRender()}
                </div>
            </div>
        );
    }

    /**
     * Renders the main app when connection is ready
     *
     * @return {*}
     */
    mainRender() {
        return (
            <Router onChange={this.routerUpdate}>
                <Home path="/"/>
                <Create path="/match/create"/>
                <Detail path="/match/:id"/>
                <Settings path="/settings"/>
            </Router>
        )
    }
}

render(<App/>, document.body);
