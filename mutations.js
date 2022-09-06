import { gql } from "@apollo/client";

export const CREATE_SURVEY = gql`
  mutation CreateSurvey($title: String!) {
    createSurvey(title: $title) {
      id
      title
      order
    }
  }
`;

export const CREATE_QUESTION = gql`
  mutation CreateQuestion(
    $text: String!
    $surveyId: ID!
    $required: Boolean!
    $answerType: String!
    $options: [String!]!
  ) {
    createQuestion(
      text: $text
      survey_id: $surveyId
      required: $required
      answerType: $answerType
      options: $options
    ) {
      id
      text
      survey_id
      required
      answerType
      options
    }
  }
`;

export const DELETE_SURVEY = gql`
  mutation DeleteSurvey($id: ID!) {
    removeSurvey(id: $id) {
      id
    }
  }
`;

export const UPDATE_SURVEY = gql`
  mutation UpdateSurvey($id: ID!, $title: String!) {
    updateSurvey(id: $id, title: $title) {
      id
      title
      order
    }
  }
`;

export const UPDATE_ORDER = gql`
  mutation UpdateOrder($id: ID!, $order: [String!]!) {
    updateSurvey(id: $id, order: $order) {
      id
      order
    }
  }
`;

export const DELETE_QUESTION = gql`
  mutation DeleteQuestion($id: ID!) {
    removeQuestion(id: $id) {
      id
    }
  }
`;

export const UPDATE_QUESTION = gql`
  mutation UpdateQuestion(
    $id: ID!
    $text: String!
    $surveyId: ID!
    $required: Boolean!
    $answerType: String!
    $options: [String!]!
  ) {
    updateQuestion(
      id: $id
      text: $text
      survey_id: $surveyId
      required: $required
      answerType: $answerType
      options: $options
    ) {
      id
      text
      required
      answerType
      options
    }
  }
`;
