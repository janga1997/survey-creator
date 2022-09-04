import { gql } from "@apollo/client";

export const GET_SURVEYS = gql`
  query GetSurveys {
    allSurveys {
      id
      title
    }
  }
`;

export const GET_QUESTIONS = gql`
  query GetQuestions($surveyId: ID!) {
    Survey(id: $surveyId) {
      id
      Questions {
        id
        text
        required
        answerType
        options
      }
    }
  }
`;
