import { CodeCommitTrigger } from "aws-lambda";
import { Commit } from "../../../domain/entities/Commit";
import { CommitParserService } from "../../../domain/services/CommitParserService";

describe('CommitParserService.parse', () => {
    it('正常系: コミット情報を正しくパース', () => {
        const record = {
            eventSourceARN: "arn:aws:codecommit:us-east-1:123456789012:front",
            codecommit: {
                references: [
                    { ref: "refs/heads/main", commit: "abc123" },
                    { ref: "refs/heads/dev", commit: "def456" }
                ]
            }
        } as CodeCommitTrigger // 型を適切に指定する必要があります

        const commits = CommitParserService.parse(record);
        expect(commits.length).toBe(2);
        expect(commits[0].getRepositoryName()).toBe("front");
        expect(commits[0].getCommitId()).toBe("abc123");
    });
});
describe('CommitParserService.toComment', () => {
    const commitParserService = new CommitParserService();
    it('正常系: コミットからBacklogコメントを生成', () => {
        const commit = new Commit("front", "abc123","[#251] :sparkles: feat: スクリーンショットプレビュー用のページを生成＆表示するページを作成");

        const comment = commitParserService.toComment(commit);
        expect(comment).toContain("**:globe_with_meridians: front**");
        expect(comment).toContain("[#251] :sparkles: feat: スクリーンショットプレビュー用のページを生成＆表示するページを作成");
        expect(comment).toContain(`[abc123](https://${process.env.AWS_REGION}.console.aws.amazon.com/codesuite/codecommit/repositories/front/commit/abc123?region=${process.env.AWS_REGION})`);
    });
});