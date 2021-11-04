import { ApiResponseBase } from '../../../models/apiResponseBase';

export interface GetPronounsApiResponse extends ApiResponseBase {
  pronouns: Array<Pronoun>;
}

export interface Pronoun {
  pronounId: number;
  language: string;
  subject: string;
  object: string;
  possessiveAdjective: string;
  possessivePronoun: string;
  reflexivePronoun: string;
}
