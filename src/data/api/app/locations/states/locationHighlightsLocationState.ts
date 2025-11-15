/**
 * Location highlights Location State
 */
export interface LocationHighlightsLocationState {
  elements: Array<{
    /**
     * Location Highlight id
     */
    id: string;

    /**
     * Location Highlight comment
     */
    comment?: string;
  }>;
}
