import { BacklogRepository } from "./backlog/BacklogRepository.js";
import { CodeCommitRepository } from "./codecommit/CodeCommitRepository.js";
type RepositoryName = "backlog" | "codecommit";

const repositories: Record<RepositoryName, new ()=> any> = {
    "backlog": BacklogRepository,
    "codecommit": CodeCommitRepository,
}
export class RepositoryFactory {
    static create<T>(repositoryName: RepositoryName):T {
        const RepositoryClass = repositories[repositoryName];
        if (RepositoryClass) {
            return new RepositoryClass();
        }
        throw new Error(`Repository ${repositoryName} is not defined.`);
    }
};