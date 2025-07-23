import { CodeCommitTrigger } from "aws-lambda";
import { Commit } from "../entities/Commit";

export class CommitParserService {
    static parse(record: CodeCommitTrigger): Commit[] {
        const repositoryName = record.eventSourceARN.split(":" ).pop() ?? "";
        const references = record.codecommit.references ?? [];
        if (references.length === 0) {
            throw new Error("コミットが存在しません");
        }
        return references.map(
        (ref) => new Commit(repositoryName, ref.commit)
        );
    }
    public toComment(commit:Commit){
        return this.generateBacklogComment(commit);
    }
    private getEmoji(repositoryName:string): string {
        const REPOSITORY_EMOJI_MAP = {
            front: ":globe_with_meridians:",
            conf: ":whale:",
            api: ":satellite:",
        };
        return repositoryName in REPOSITORY_EMOJI_MAP
            ? REPOSITORY_EMOJI_MAP[repositoryName as keyof typeof REPOSITORY_EMOJI_MAP]
            : "";
    }
    private generateBacklogComment(commit: Commit): string {
        const repositoryName = commit.getRepositoryName();
        const emoji = this.getEmoji(repositoryName);
        const commitMsg = commit.getCommitMsg();
        const commitId = commit.getCommitId();
        return `**${emoji} ${repositoryName}** \n${commitMsg}\n\n[${commitId}](https://${process.env.AWS_REGION}.console.aws.amazon.com/codesuite/codecommit/repositories/${repositoryName}/commit/${commitId}?region=${process.env.AWS_REGION})`;
    }
}