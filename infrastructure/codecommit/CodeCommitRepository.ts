import { CodeCommitClient, Commit, GetCommitCommand } from "@aws-sdk/client-codecommit";
import { ICodeCommitRepository } from "../../interfaces/Repository.js";
export class CodeCommitRepository implements ICodeCommitRepository {
    private client = new CodeCommitClient({ region: process.env.AWS_REGION });

    public async getCommitById(commitId: string, repositoryName: string): Promise<Commit | undefined> {
        try {
            const command = new GetCommitCommand({
                repositoryName: repositoryName,
                commitId: commitId
            });
            const response = await this.client.send(command);
            return response.commit;
        } catch (error) {
            console.error(`Error fetching commit ${commitId}:`, error);
            throw error;
        }
    }

}