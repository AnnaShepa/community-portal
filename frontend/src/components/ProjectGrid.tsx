
import _filter from 'lodash/filter';
import includes from 'lodash/includes';
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { withStyles, Theme } from '@material-ui/core/styles';

import IntroText from './IntroText';
import ProjectCard from './ProjectCard';
import { loadProjects } from './../actions';

import Grid from '@material-ui/core/Grid';

const styles = (theme: Theme) => ({
  invisibleCard: {
    'background-color': '#FFFFFF',
    opacity: 0,
    height: '1rem',
    [theme.breakpoints.down('md')]: {
      width: '20rem',
    },
    [theme.breakpoints.up('md')]: {
      width: '25rem',
    },
    [theme.breakpoints.up('lg')]: {
      width: '30rem',
    },
    display: 'flex',
    'flex-direction': 'column',
    'justify-content': 'space-between',
  },
  hiddenGridSmall: {
    [theme.breakpoints.down(783)]: {
      display: 'none',
    },
  },
  hiddenGridLarge: {
    [theme.breakpoints.down(1615)]: {
      display: 'none',
    },
  },
});

interface GridStateProps {
  projects: any;
  user: any;
}

interface DispatchProps {
  loadProjects: () => void;
}

interface GridProps {
  project?: {};
  user?: any;
  handler?: () => void;
  filter?: string;
  classes?: any;
}

interface IProject {
  id: string;
  name: string;
  title?: string;
  description: string;
  technologies: [string];
  estimated: number;
  pledged?: number;
  due_date?: string;
  hours_goal?: number;
  github: string;
  slack?: string;
  size?: string;
  pledgers: Pledger[];
  created_date: string;
}

interface Pledger {
  avatar_url?: string;
}

interface GridState {
  projects: IProject[];
}

export class ProjectGrid extends React.Component<GridProps & GridStateProps & DispatchProps, GridState> {

  constructor(props: GridProps & GridStateProps & DispatchProps) {
    super(props);
    this.updateGrid = this.updateGrid.bind(this);
  }

  checkLike(id: string) {
    return this.props.user.likedProjects.indexOf(id) !== -1;
  }

  checkBookmark(id: string) {
    return this.props.user.bookmarkedProjects.indexOf(id) !== -1;
  }

  updateGrid() {
    this.props.loadProjects();
  }

  filter() {
    if (typeof this.props.filter !== 'undefined') {
      if (this.props.filter === 'pledgedProjects') {
        return _filter(this.props.projects, (project: any) => {
          return includes(Object.keys(project.pledgers), this.props.user.user_id);
        });
      }

      if (typeof this.props.user === 'undefined' || !Array.isArray(this.props.user[this.props.filter])) {
        throw `The filter ${this.props.filter} must be an array in the user redux store`;
      }

      return _filter(this.props.projects, (project: any) => {
        const filter:any = this.props.filter;
        return includes(this.props.user[filter], project.project_id);
      });
    }
    return this.props.projects;
  }

  componentDidMount() {
    this.updateGrid();
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
      <IntroText />
        <Grid
          container
          direction="row"
          spacing={32}
          justify="center"
        >
          {this.props.projects && this.filter().map((project: any) => (
            <Grid item key={project.project_id}>
              <ProjectCard
                project={project}
                handler={this.updateGrid}
                liked={this.checkLike(project.project_id)}
                bookmarked={this.checkBookmark(project.project_id)}
              />
            </Grid>
          ))}
          {classes && <Grid item className={classes.hiddenGridSmall}><div className={classes.invisibleCard} /></Grid>}
          {classes && <Grid item className={classes.hiddenGridLarge}><div className={classes.invisibleCard} /></Grid>}
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    projects: state.project,
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    loadProjects: () => dispatch(loadProjects()),
  };
};

export default compose<GridStateProps, GridProps>(
  withStyles(styles, {
    name: 'ProjectGrid',
  }),
  connect<GridStateProps, DispatchProps, GridProps>(
    mapStateToProps, mapDispatchToProps,
  ),
)(ProjectGrid);
