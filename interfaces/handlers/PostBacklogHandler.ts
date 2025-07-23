import { CodeCommitTriggerEvent, CodeCommitHandler, Context } from "aws-lambda";
import { CommitParserService } from "../../domain/services/CommitParserService";
import { RepositoryFactory } from "../../infrastructure/RepositoryFactory";
import { PostCommentToBacklogUseCase } from "../../usecases/PostCommentToBacklogUsecase";
import { IBacklogRepository, ICodeCommitRepository } from "../Repository";
import { errorHandler } from "./ErrorHandler";

type Response = {
  status?: number;
  message?: string;
  [key: string]: any;
};
/**
 * @param {{ Records:{ awsRegion: string,codecommit: { references: { ref: string, commit: string }[] },eventId: string,eventName:string,eventPartNumber: number,eventSource: string,eventSourceARN: string,eventTime: string,eventTriggerName: string}[]}} event
 */
//
export const postBacklogHandler = async (
  event: CodeCommitTriggerEvent,
  context: Context
): Promise<Response> => {
  try {
    const eventRecord = event.Records[0];
    // push以外やイベントが最初のパートでない場合は処理対象外
    if (
      eventRecord?.eventName !== "ReferenceChanges" ||
      eventRecord?.eventPartNumber !== 1
    ) {
      return {
        status: 200,
        message: "対象外イベントのため処理なし",
      };
    }
    // // リポジトリー名の取得
    const commits = CommitParserService.parse(eventRecord);
    const backlogRepository =
      RepositoryFactory.create<IBacklogRepository>("backlog");
    const codeCommitRepository =
      RepositoryFactory.create<ICodeCommitRepository>("codecommit");
    const usecase = new PostCommentToBacklogUseCase(
      backlogRepository,
      codeCommitRepository
    );
    const result = await usecase.execute(commits);
    if (result.length === 0) {
      throw new Error("課題へのコメント追加に失敗しました");
    }
    return {
      status: 200,
      message: "課題へのコメント追加に成功しました"
    };
  } catch (error) {
    return errorHandler(error);
  }
};
