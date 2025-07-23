import { IBacklogRepository } from "../../interfaces/Repository";
import axios,{ AxiosInstance } from "axios";
import querystring from "node:querystring";

export class BacklogRepository implements IBacklogRepository {
    private baseUrl: string =`https://${process.env.BACKLOG_DOMAIN}.backlog.com/api/v2`;
    private apiKey: string = process.env.BACKLOG_API_KEY ?? "";
    private axiosInstance: AxiosInstance;
    constructor() {
        this.axiosInstance = this.createAxiosInstance();
    }
    private createAxiosInstance() {
        return axios.create({
            baseURL: this.baseUrl,
            params: {
                apiKey: this.apiKey
            }
        });
    }
    async postComment(issueId: string, comment: string): Promise<any> {
        try {
            const data = querystring.stringify({
            content: comment,
            });
            const response = await this.axiosInstance.post(`/issues/${process.env.PROJECT_NAME}-${issueId}/comments?apiKey=${this.apiKey}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error posting comment to issue ${issueId}:`, error);
            throw error;
        }
    }

    

}