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
    }
  }
`;

export const UPDATE_SURVEY_ORDER = gql`
  mutation UpdateSurveyOrder($id: uuid!, $order: jsonb!) {
    update_Survey_by_pk(pk_columns: { id: $id }, _set: { order: $order }) {
      id
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
      order
    }
  }
`;

export const UPDATE_FOLDER_NAME = gql`
  mutation UpdateFolderName($id: uuid!, $name: String!) {
    update_Folder_by_pk(pk_columns: { id: $id }, _set: { name: $name }) {
      id
      name
    }
  }
`;

export const DELETE_FOLDER = gql`
  mutation DeleteFolder($folderId: uuid!) {
    delete_Folder_by_pk(id: $folderId) {
      id
    }
  }
`;

export const MOVE_BETWEEN_FOLDERS = gql`
  mutation MoveBetweenFolders(
    $questionIds: [uuid!]
    $folderIds: [uuid!]
    $currentFolderId: uuid!
    $currentFolderOrder: jsonb!
    $newFolderId: uuid!
    $newFolderOrder: jsonb!
  ) {
    update_Question_many(
      updates: {
        where: { id: { _in: $questionIds } }
        _set: { folder_id: $newFolderId }
      }
    ) {
      returning {
        id
        folder_id
      }
    }
    update_Folder_many(
      updates: {
        where: { id: { _in: $folderIds } }
        _set: { folder_id: $newFolderId }
      }
    ) {
      returning {
        id
        folder_id
      }
    }
    current: update_Folder_by_pk(
      pk_columns: { id: $currentFolderId }
      _set: { order: $currentFolderOrder }
    ) {
      id
      order
    }
    new: update_Folder_by_pk(
      pk_columns: { id: $newFolderId }
      _set: { order: $newFolderOrder }
    ) {
      id
      order
    }
  }
`;

export const MOVE_BETWEEN_FOLDERS_SURVEYS = gql`
  mutation MoveBetweenFoldersSurveys(
    $questionIds: [uuid!]
    $folderIds: [uuid!]
    $surveyId: uuid!
    $surveyOrder: jsonb!
    $newFolderId: uuid
    $parentFolderId: uuid!
    $parentFolderOrder: jsonb!
  ) {
    update_Question_many(
      updates: {
        where: { id: { _in: $questionIds } }
        _set: { folder_id: $newFolderId }
      }
    ) {
      returning {
        id
        folder_id
      }
    }
    update_Folder_many(
      updates: {
        where: { id: { _in: $folderIds } }
        _set: { folder_id: $newFolderId }
      }
    ) {
      returning {
        id
        folder_id
      }
    }
    update_Folder_by_pk(
      pk_columns: { id: $parentFolderId }
      _set: { order: $parentFolderOrder }
    ) {
      id
      order
    }
    update_Survey_by_pk(
      pk_columns: { id: $surveyId }
      _set: { order: $surveyOrder }
    ) {
      id
      order
    }
  }
`;
