import { gql } from "@apollo/client";

export const GET_SURVEYS = gql`
  query GetSurveys {
    Survey {
      id
      title
      order
    }
  }
`;

export const GET_SURVEY_DATA = gql`
  query GetSurveyData($surveyId: uuid!) {
    Survey_by_pk(id: $surveyId) {
      id
      order
      title
      Questions {
        id
        text
        required
        answerType
        options
        folder_id
      }
      Folders {
        id
        name
        order
        folder_id
      }
    }
  }
`;
