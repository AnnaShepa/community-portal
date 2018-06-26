import * as React from 'react';
import { connect } from 'react-redux';
import GithubAuthButton from './GithubAuthButton';
import { onSuccess, onFailure } from './HeadBar';
import { UpdateUserRoleAction } from '../actions';

interface WithAuthProps {
  user?: any;
  handler?: any;
  liked?: boolean;
  upvotes?: number;
  project_id?: string;
  label?: string;
}

interface WithAuthStateProps {
  user?: any;
}

interface WithAuthDispatchProps {
  updateUserRole?: any;
}

const Authorization = (allowedRoles:any) => (WrappedComponent:any) => {
  const Login = GithubAuthButton(WrappedComponent);
  class WithAuth extends React.Component<WithAuthProps & WithAuthStateProps & WithAuthDispatchProps, {}> {
    constructor(props: WithAuthProps) {
      super(props);
    }
    render() {
      const { role } = this.props.user;
      if (allowedRoles.includes(role)) {
        return <WrappedComponent {...this.props} />;
      }
      return <Login
        clientId="668e0b6c450cc783f267" // Github auth application client_id
        scope="" // Github permission scopes
        redirectUri="http://localhost:3030/auth" // Callback url, as example domain.com/auth
        onSuccess={onSuccess}
        onFailure={onFailure}
        user={this.props.user}
        updateUserRole={this.props.updateUserRole}
      />;
    }
  }
  const mapStateToProps = (state: any) => {
    return {
      user: state.user,
    };
  };

  const mapDispatchToProps = (dispatch: any) => {
    return {
      updateUserRole: (id: string, role: string) => dispatch(UpdateUserRoleAction(id, role)),
    };
  };

  return connect<WithAuthStateProps, WithAuthDispatchProps, WithAuthProps>(mapStateToProps, mapDispatchToProps)(WithAuth);
};

export default Authorization;
