
export class Commit {
    private commitMsg: string = "";
    private repositoryName: string = "";
    private commitId: string = "";
    constructor(repositoryName: string, commitId: string, commitMsg: string = "") {
        this.repositoryName = repositoryName;
        this.commitId = commitId;
        this.commitMsg = commitMsg;
    }
    extractIssueId(): string | null {
        // [#123]のような形式でチケット番号を取得するための正規表現
        const regex = /^\[#(\d+)]/;
        const match = this.commitMsg.match(regex);
        if (match) {
            return match[1];
        }
        return null;
    }
    setCommitMsg(commitMsg: string): void {
        if (typeof commitMsg !== "string") {
            return; // 型チェックを追加
        }
        this.commitMsg = commitMsg;
    }
    getCommitMsg(): string {
        return this.commitMsg;
    }
    getRepositoryName(): string {
        return this.repositoryName;
    }
    getCommitId(): string {
        return this.commitId;
    }
}