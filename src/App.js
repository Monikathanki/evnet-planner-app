import React from "react";
import { Route } from "react-router-dom";
import "./App.css";

import Nav from "./Components/Nav/Nav";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import EventsList from "./Components/EventsList/EventsList";
import TeamEventsList from "./Components/TeamEventsList/TeamEventsList";
import Event from "./Components/Event/Event";
import EditEvent from "./Components/EditEvent/EditEvent";
import TeamList from "./Components/TeamList/TeamList";
import AddTeamMember from "./Components/AddTeamMember/AddTeamMember";
import CalendarView from "./Components/Calendar/Calendar";
import AddEvent from "./Components/AddEvent/AddEvent";
import TokenService from "./Services/TokenService";
import config from  "./Config/Config"
import AddTeam from "./Components/AddTeam/AddTeam"
import TeamMember from "./Components/TeamMember/TeamMember";
import Dashboard from "./Components/Dashboard/Dashboard";

export default class App extends React.Component {
  state = {
    isLoggedIn: false,
    events: [],
    user: {
      user_id: "",
      email: "",
      firstName: "",
    },
    teams: [],
    teamMembers: [],
  };

  setUser = (user) => {
    this.setState({
      user: {
        user_id: user.id,
        email: user.email,
        firstName: user.first_name,
      },
    });
  };

  createTeam = (newTeam) => {
    this.setState({
      teams: newTeam,
    });
  };

  setUserTeams = (teams) => {
    this.setState({
      teams: teams,
    });
  };

  setUserTeamMembers = (tmembers) => {
    this.setState({
      teamMembers: tmembers,
    });
  };

  createEvent = (event) => {
    this.setState({
      events: [...this.state.events, event],
    });
  };

  updateEvent = (updatedEvent) => {
    this.setState({
      events: this.state.events.map((e) =>
        e.id !== updatedEvent.id ? e : updatedEvent
      ),
    });
  };

  // Gets events created by you
  setUserEvents = (events) => {
    this.setState({
      events: events,
    });
  };

  updateTeamMembers =(teamMember) => {
    this.setState({
      teamMembers: [...this.state.teamMembers, teamMember]
    })

  }
  updateTeam = (team) => {
    this.setState({
      teams: [...this.state.teams, team]
    })

  }

  // Gets events for teams you're a team member of
  setTeamMemberEvents = (events) => {
    this.setState({
      events: [...this.state.events, ...events],
    });
  };

   deleteEvent = (eventId) => {
     const newEvents = this.state.events.filter((event) => event.id !== eventId);
     this.setState({
       events:newEvents,
     })
   }

  handleLogin = () => {
    this.setState({
      isLoggedIn: true,
    });
  };

  handleLogout = () => {
    TokenService.clearAuthToken();
    this.setState({
      events: [],
      team: [],
    });
  };

  componentDidMount() {
    fetch(`${config.REACT_APP_API_BASE_URL}/events`)
    .then((res) => res.json())
    .then((events) => this.setState({events}));

    fetch(`${config.REACT_APP_API_BASE_URL}/teams`)
    .then((res) => res.json())
    .then((teams) => this.setState({teams}));

    if (TokenService.hasAuthToken()) {
      const { user_id } = TokenService.readJwtToken()
      fetch(`${config.REACT_APP_API_BASE_URL}/team-members/${user_id}`)
      .then((res) => res.json())
      .then((teamMembers) => this.setState({teamMembers}));
    }
    
  
  }

  render() {
    return (
      <div className="App">
        <Route
          path="/"
          render={(props) => (
            <Nav {...props} {...this.state} handleLogout={this.handleLogout} />
          )}
        />

        <Route exact path="/" component={Header} />
        <Route
          exact
          path="/login"
          render={(props) => (
            <Login {...props} handleLogin={this.handleLogin} />
          )}
        />

        <Route exact path="/register" component={Register} />
        <main>
           <section className="main-dashboard">
            <Route exact path="/dashboard" component={Dashboard} />
          </section>
          <section className="main-events">
            <Route
              exact
              path={["/events", "/events/:id", "/add-event"]}
              render={(props) => <EventsList {...props} {...this.state} />}
            />
            <Route
              exact
              path={["/tm-events", "/tm-events/:id"]}
              render={(props) => <TeamEventsList {...props} {...this.state} />}
            />
            <Route
              exact
              path={["/events", "/events/:id", "/tm-events", "/tm-events/:id"]}
              render={(props) => 
              <Event 
              {...props} 
              deleteEvent={this.deleteEvent}
              {...this.state} />}
            />
            <Route
              exact
              path="/add-event"
              render={(props) => (
                <AddEvent
                  {...this.state}
                  createEvent={this.createEvent}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/edit-event/:id"
              render={(props) => (
                <EditEvent {...props} updateEvent={this.updateEvent} />
              )}
            />
          </section>
          <section className="main-team">
            <Route
              exact
              path={["/teams", "/teams/team-member/:id"]}
              render={(props) => <TeamList {...props} 
              // createTeam ={this.createTeam}
              {...this.state} />}
            />
            <Route
              exact
              path={["/teams", "/teams/team-member/:id"]}
              render={(props) => <TeamMember {...props} {...this.state} />}
            />
            <Route
              exact
              path={["/add-team"]}
              render={(props) => <AddTeam {...props} 
              createTeam={this.createTeam}
              updateTeam={this.updateTeam}
              {...this.state} />}
            />
            <Route
              exact
              path="/add-team-member"
              render={(props) => <AddTeamMember {...props} updateTeamMembers={this.updateTeamMembers} {...this.state} />}
            />
            {/* <Route
              exact
              path={["/invite-page", "/invite-page/:id"]}
              component={InviteLandingPage}
            /> */}
          </section>
          <section className="main-calendar">
            <Route
              exact
              path="/calendar"
              render={(props) => <CalendarView {...props} {...this.state} />}
            />
          </section>
          <Route path="/" component={Footer} />
        </main>
      </div>
    );
  }
}