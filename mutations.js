import { gql } from "@apollo/client";

export const CREATE_SURVEY = gql`
  mutation CreateSurvey($title: String!) {
    insert_Survey_one(object: { title: $title, order: [] }) {
      id
      order
      title
    }
  }
`;

export const CREATE_QUESTION = gql`
  mutation CreateQuestion(
    $text: String!
    $surveyId: uuid!
    $folderId: uuid
    $required: Boolean!
    $answerType: String!
    $options: jsonb
  ) {
    insert_Question_one(
      object: {
        text: $text
        survey_id: $surveyId
        folder_id: $folderId
        required: $required
        answerType: $answerType
        options: $options
      }
    ) {
      id
      answerType
      folder_id
      options
      required
      survey_id
      text
    }
  }
`;

export const DELETE_SURVEY = gql`
  mutation DeleteSurvey($id: uuid!) {
    delete_Survey_by_pk(id: $id) {
      id
    }
  }
`;

export const UPDATE_SURVEY = gql`
  mutation UpdateSurvey($id: uuid!, $title: String!) {
    update_Survey_by_pk(pk_columns: { id: $id }, _set: { title: $title }) {
      id
      title
      order
    }
  }
`;

export const UPDATE_SURVEY_ORDER = gql`
  mutation UpdateSurveyOrder($id: uuid!, $order: jsonb!) {
    update_Survey_by_pk(pk_columns: { id: $id }, _set: { order: $order }) {
      id
      title
      order
    }
  }
`;

export const DELETE_QUESTION = gql`
  mutation DeleteQuestion($id: uuid!) {
    delete_Question_by_pk(id: $id) {
      id
    }
  }
`;

export const UPDATE_QUESTION = gql`
  mutation UpdateQuestion(
    $id: uuid!
    $text: String!
    $surveyId: uuid!
    $required: Boolean!
    $answerType: String!
    $options: jsonb!
  ) {
    update_Question_by_pk(
      pk_columns: { id: $id }
      _set: {
        text: $text
        survey_id: $surveyId
        required: $required
        answerType: $answerType
        options: $options
      }
    ) {
      id
      text
      required
      answerType
      options
    }
  }
`;

export const CREATE_FOLDER = gql`
  mutation CreateFolder($name: String!, $surveyId: uuid!, $folderId: uuid) {
    insert_Folder_one(
      object: { folder_id: $folderId, name: $name, survey_id: $surveyId }
    ) {
      id
      folder_id
      name
      order
      survey_id
    }
  }
`;

export const UPDATE_FOLDER_ORDER = gql`
  mutation UpdateFolderOrder($folderId: uuid!, $order: jsonb!) {
    update_Folder_by_pk(
      pk_columns: { id: $folderId }
      _set: { order: $order }
    ) {
      id
      name
      order
      folder_id
    }
  }
`;
