export interface CreateIssuePayload {
  title: string;
  description: string;
  id: number;
  type: string;
}

export type IssueFilters = {
  sort: string;
  type?: string | undefined;
  status?: string | undefined;
};