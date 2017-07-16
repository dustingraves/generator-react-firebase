import React, { Component, PropTypes } from 'react'
import Paper from 'material-ui/Paper'<% if (includeRedux) { %>
import { connect } from 'react-redux'
import { firebaseConnect, pathToJS, isLoaded } from 'react-redux-firebase'
import { reduxFirebase as fbReduxSettings } from 'config'
import { UserIsAuthenticated } from 'utils/router'<% } %>
import defaultUserImageUrl from 'static/User.png'
import LoadingSpinner from 'components/LoadingSpinner'
import AccountForm from '../components/AccountForm/AccountForm'
import classes from './AccountContainer.scss'

<% if (includeRedux) { %>@UserIsAuthenticated // redirect to /login if user is not authenticated
@firebaseConnect()
@connect(({ firebase }) => ({
  auth: pathToJS(firebase, 'auth'),
  account: pathToJS(firebase, 'profile')
}))<% } %>
export default class Account extends Component {
  <% if (includeRedux) { %>static propTypes = {
    account: PropTypes.object,
    auth: PropTypes.object,
    firebase: PropTypes.shape({
      logout: PropTypes.func.isRequired
    })
  }

  updateAccount = (newAccount) => {
    const { firebase: { update }, auth } = this.props
    // corresponds to /users/${uid}
    return update(`${fbReduxSettings.userProfile}/${auth.uid}`, newAccount)
  }<% } %>
<% if (!includeRedux) { %>
  handleSave = () => {
    // TODO: Handle saving image and account data at the same time
    const account = {
      name: this.refs.name.getValue(),
      email: this.refs.email.getValue()
    }
  }
<% } %>
  render () {
    const { account } = this.props

    if (!isLoaded(account)) {
      return <LoadingSpinner />
    }

    return (
      <div className={classes.container}>
        <Paper className={classes.pane}>
          <div className={classes.settings}>
            <div className={classes.avatar}>
              <img
                className={classes.avatarCurrent}
                src={account && account.avatarUrl ? account.avatarUrl : defaultUserImageUrl}
                onClick={this.toggleModal}
              />
            </div>
            <div className={classes.meta}>
              <AccountForm
                onSubmit={this.updateAccount}
                initialValues={account}
              />
            </div>
          </div>
        </Paper>
      </div>
    )
  }
}
