import S3Adapter from './../S3Adapter';
import S3Connection from './../S3Connection';
import trainProjectRecommendationModel from './../../algorithms/trainProjectRecommendationModel';

const PROJECT_RECOMMENDATION_BUCKET = process.env.PROJECT_RECOMMENDATION_BUCKET;

interface ProjectRecommendationEngineInterface {
  getRecommendations(data: any): Promise<any>;
}

function getSignature(array: string[]) {
  return JSON.stringify(array);
}

function getRandomElements(array: any[], n: number) {
  const shuffled = array.sort(() => .5 - Math.random());
  return shuffled.slice(0, n);
}

export default class ProjectRecommendationEngine implements ProjectRecommendationEngineInterface {
  private adapter: any;

  constructor(s3: S3Connection) {
    this.adapter = new S3Adapter(s3);
  }

  getModel(data: any): Promise<any> {
    return this.adapter.get(PROJECT_RECOMMENDATION_BUCKET, 'model');
  }

  getRecommendations(data: any): Promise<any> {
    const { model, last_visited, project_id } = data;

    // currently recommend one project
    // adapt to recommend multiple projects based on delta
    const state: any = [];
    last_visited.slice().reverse().forEach((prev_state: any) => state.push(prev_state.project_id));
    state.push(project_id);
    const stateSignature = getSignature(state);

    if (model.hasOwnProperty(stateSignature)) {
      return new Promise((resolve: any) => {
        return resolve({ recommended: [model[stateSignature]] });
      });
    }

    // temporary solution
    // randomly recommend two projects if no sequence is found
    const projects = [
      '8f1b18ab-907f-4c59-8778-f56154fd6c27',
      'd2de6415-403f-41d1-b722-c178653828c7',
      'b8c129ed-d004-4fa7-9012-61f3e95bd757',
      'e701e6b3-c39c-408e-9188-2df4e6fc6a81',
    ];

    const projectPool: any = [];

    for (const project of projects) {
      if (project !== project_id) projectPool.push(project);
    }

    return new Promise((resolve: any) => {
      return resolve({ recommended: getRandomElements(projectPool, 2) });
    });
  }

  trainModel(data: any): Promise<any> {
    const { projects, traffic } = data;
    const model = trainProjectRecommendationModel(projects, traffic);
    console.log(model);
    return this.adapter.put(PROJECT_RECOMMENDATION_BUCKET, 'model', model);
  }
}
