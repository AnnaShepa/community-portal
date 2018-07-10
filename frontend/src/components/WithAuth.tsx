import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import GithubAuthButton, { User }from './GithubAuthButton';
import { onSuccess, onFailure } from './HeadBar';
import { LoadUserAction,
         UpdateUserRoleAction,
         getLikedProjectsAction,
        } from '../actions';

declare const __FRONTEND__: string;
export const frontEnd = __FRONTEND__;

interface WithAuthProps {
  className?: any;
  user?: any;
  handler?: any;
  liked?: boolean;
  upvotes?: number;
  project_id?: string;
  label?: string;
  clientId?: string;
  scope?: string;
  redirectUri?: string;
  onSuccess?: any;
  onFailure?: any;
  toggleLike?: any;
  likeProject?: any;
}

interface WithAuthStateProps {
  user?: any;
}

interface WithAuthDispatchProps {
  loadUser?: any;
  updateUserRole?: any;
  getLikedProjects?: any;
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
        clientId={process.env.GIT_ID || ''}
        scope=""
        redirectUri={`${frontEnd}/auth`}
        onSuccess={onSuccess}
        onFailure={onFailure}
        user={this.props.user}
        loadUser={this.props.loadUser}
        updateUserRole={this.props.updateUserRole}
        getLikedProjects={this.props.getLikedProjects}
      />;
    }
  }
  const mapStateToProps = (state: any) => {
    return {
      user: state.user,
    };
  };

  const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
      getLikedProjects: () => dispatch(getLikedProjectsAction()),
      loadUser: (user: User) => dispatch(LoadUserAction(user)),
      updateUserRole: (id: string, role: string) => dispatch(UpdateUserRoleAction(id, role)),
    };
  };

  return connect<WithAuthStateProps, WithAuthDispatchProps, WithAuthProps>(mapStateToProps, mapDispatchToProps)(WithAuth);
};

export default Authorization;
