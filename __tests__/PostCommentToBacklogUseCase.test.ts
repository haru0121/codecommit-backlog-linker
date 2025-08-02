import { Commit } from "../domain/entities/Commit";
import { PostCommentToBacklogUseCase } from "../usecases/PostCommentToBacklogUsecase";

describe("PostCommentToBacklogUseCase", () => {
  const mockCodeCommitRepo = {
    getCommitById: jest.fn(),
  };

  const mockBacklogRepo = {
    postComment: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("正常系: コミットメッセージからチケットIDを抽出しBacklogに投稿", async () => {
    const commits = [
      new Commit("front", "abc123"),
      new Commit("front", "def456"),
    ];

    // CodeCommit からメッセージを取得
    mockCodeCommitRepo.getCommitById
      .mockResolvedValueOnce({
        commitId: "abc123",
        message: "[#101] Fix header bug",
      })
      .mockResolvedValueOnce({
        commitId: "def456",
        message: "[#102] Update footer style",
      });

    // Backlog 側
    mockBacklogRepo.postComment.mockResolvedValue(true);

    const usecase = new PostCommentToBacklogUseCase(
      mockBacklogRepo,
      mockCodeCommitRepo
    );

    const result = await usecase.execute(commits);

    expect(result).toEqual([true, true]);
    expect(mockCodeCommitRepo.getCommitById).toHaveBeenCalledTimes(2);
    expect(mockCodeCommitRepo.getCommitById).toHaveBeenCalledWith("abc123", "front");
    expect(mockCodeCommitRepo.getCommitById).toHaveBeenCalledWith("def456", "front");
    expect(mockBacklogRepo.postComment).toHaveBeenCalledTimes(2);
    expect(mockBacklogRepo.postComment).toHaveBeenCalledWith(
      "101",
      "**:globe_with_meridians: front** \n[#101] Fix header bug\n\n[abc123](https://undefined.console.aws.amazon.com/codesuite/codecommit/repositories/front/commit/abc123?region=undefined)"
    );
    expect(mockBacklogRepo.postComment).toHaveBeenCalledWith(
      "102",
      "**:globe_with_meridians: front** \n[#102] Update footer style\n\n[def456](https://undefined.console.aws.amazon.com/codesuite/codecommit/repositories/front/commit/def456?region=undefined)"
    );
  });

    it("異常系: チケットIDを含まないコミットはスキップ", async () => {
      const commits = [new Commit("api", "ghi789")];

      mockCodeCommitRepo.getCommitById.mockResolvedValue("no ticket info");

      const usecase = new PostCommentToBacklogUseCase(
          mockBacklogRepo,
          mockCodeCommitRepo
      );

      const result = await usecase.execute(commits);

      expect(result).toEqual([]); // エラーにはしない
      expect(mockBacklogRepo.postComment).not.toHaveBeenCalled();
    });

  //   it("異常系: Backlogへの投稿に失敗した場合", async () => {
  //     const commits = [new Commit("conf", "zzz111")];

  //     mockCodeCommitRepo.getCommitMessage.mockResolvedValue("[#999] Try fail");
  //     mockBacklogRepo.findIssueId.mockResolvedValue(888);
  //     mockBacklogRepo.postComment.mockResolvedValue(false); // ← 投稿失敗

  //     const usecase = new PostCommentToBacklogUseCase(
  //         mockBacklogRepo,
  //         mockCodeCommitRepo
  //     );

  //     const result = await usecase.execute(commits);

  //     expect(result).toBe(false); // 一部失敗したら false
  //     expect(mockBacklogRepo.findIssueId).toHaveBeenCalled();
  //     expect(mockBacklogRepo.postComment).toHaveBeenCalled();
  //   });
});
