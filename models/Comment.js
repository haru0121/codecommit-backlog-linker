export class Comment {
    REPOSITORY_EMOJI_MAP = {
        front: ":globe_with_meridians:",
        conf: ":whale:",
        api: ":satellite:",
    };

    constructor(repositoryName, commitMsg, commitId) {
        this.repositoryName = repositoryName;
        this.emoji = this.getEmoji(repositoryName);
        this.commitMsg = commitMsg;
        this.commitId = commitId;
    }
    getEmoji(repositoryName) {
        return REPOSITORY_EMOJI_MAP[repositoryName] || "";
    }
    generateBacklogComment() {
        return `**${this.emoji} ${this.repositoryName}** \n${this.commitMsg}\n\n[${this.commitId}](https://${process.env.AWS_REGION}.console.aws.amazon.com/codesuite/codecommit/repositories/${this.repositoryName}/commit/${this.commitId}?region=${process.env.AWS_REGION})`;
    }
}