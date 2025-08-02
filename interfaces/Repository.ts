export interface IRepository {
  index(): Promise<any>
  show(id: string): Promise<any>
  post(payload: any): Promise<any>
  delete(id: string): Promise<any>
}

export interface IBacklogRepository {
  postComment(issueId: string, comment: string): Promise<any>
}

export interface ICodeCommitRepository {
  getCommitById(commitId: string, repositoryName: string): Promise<any>
}
