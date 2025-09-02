import { Commit } from "../domain/entities/Commit";
import { CommitParserService } from "../domain/services/CommitParserService";
import {
  IBacklogRepository,
  ICodeCommitRepository,
} from "../interfaces/Repository";

export class PostCommentToBacklogUseCase {
  constructor(
    private backlogRepository: IBacklogRepository,
    private codeCommitRepository: ICodeCommitRepository
  ) {}
  async execute(commits: Commit[]) {
    const commitParserService = new CommitParserService();
    const results = await Promise.all(
      commits.map(async (commit) => {
        const commitDetail = await this.codeCommitRepository.getCommitById(
          commit.getCommitId(),
          commit.getRepositoryName()
        );
        if (!commitDetail || !commitDetail?.message) {
          console.warn(`Commit ${commit.getCommitId()} not found`);
          return;
        }
        commit.setCommitMsg(commitDetail.message);
        // commitからIssueIdを抽出
        const issueId = commit.extractIssueId();
        if (!issueId) {
          console.warn(`Issue ID not found in commit ${commit.getCommitId()}`);
          return;
        }
        const comment = commitParserService.toComment(commit);
        return this.backlogRepository.postComment(issueId, comment);
      })
    );
    return results.filter((result) => result !== undefined);
  }
}
