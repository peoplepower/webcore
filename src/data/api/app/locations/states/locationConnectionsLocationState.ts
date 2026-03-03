/**
 * Location Connections Location State
 */
export interface LocationConnectionsLocationState {
  connections: {
    [connectionId: string]: LocationConnection;
  };
}

interface LocationConnection {
  birth_date_ms: number;
  notified: boolean;
  completed: boolean;
  questionnaire_sent: boolean;
  questionnaire_reminder_sent: boolean;
  questionnaire_completed: boolean;
  questionnaire_survey_url: string;
  connection_date_question_key: string;
  connection_date_iso: string;
  connection_date_ms: number;
  personalized_plan_sent: boolean;
  personalized_plan_completed: boolean;
  personalized_plan_survey_url: string;
  personalized_plan_referral_survey_url: string;
  questionnaire_answer_id: number;

  questionnaire_scores: {
    [scoreKey: string]: {
      score: number;
      tier: number;
      tier_description: string;
    };
  };

  questionnaire_overall_quality_of_life_comments: string[];

  personalized_plan_answer_id: number;

  wellness_assessments: {
    [assessmentDateMs: string]: {
      muscular_strength_score: number;
      flexibility_score: number;
      balance_agility_score: number;
      cardio_fitness_endurance_score: number;
      moca_score: string;
      phq9_total_score: number;
      frailty_score_total: number;
    };
  };

  questionnaire_completed_date_ms: number;

  personalized_plan_connection_info: {
    action_steps: string;
    connection_date: string;
    growth_opportunities: string;
    notes: string;
    physician: string;
    strengths: string;
  };

  personalized_plan_referrals: {
    [categoryId: string]: {
      title: string;
      referrals: {
        [referralKey: string]: {
          referral: string;
          referral_requested: boolean;
          referral_requested_date_ms: number;
          referral_completed?: boolean;
          referral_reason?: string;
        };
      };
    };
  };

  personalized_plan_completed_date_ms: number;
  personalized_plan_referral_answer_id: number;
}
