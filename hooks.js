import { useMutation, useQuery } from "@apollo/client";
import { groupBy } from "lodash-es";
import {
  DELETE_FOLDER,
  MOVE_BETWEEN_FOLDERS,
  MOVE_BETWEEN_FOLDERS_SURVEYS,
  UPDATE_FOLDER_ORDER,
  UPDATE_SURVEY_ORDER,
} from "mutations";
import { useRouter } from "next/router";
import { GET_SURVEY_DATA } from "queries";
import { useState } from "react";

import useSurveyStore from "store";

export const useFormChange = (initialState) => {
  const [formState, setFormState] = useState(initialState);

  const onInputChange = (event) => {
    const { target } = event;
    const { type, name } = target;

    const value = type === "checkbox" ? target.checked : target.value;

    let resetOptions = {};
    if (name === "answerType" && !value.includes("SELECT")) {
      resetOptions = { options: [] };
    }

    setFormState({ ...formState, [name]: value, ...resetOptions });
  };

  return [formState, onInputChange, setFormState];
};

export const useToggle = (initialValue = false) => {
  const [boolValue, setBool] = useState(initialValue);

  const toggleValue = () => setBool(!boolValue);

  return [boolValue, toggleValue, setBool];
};

export const useUpdateSurveyOrder = () => {
  const {
    query: { surveyId },
  } = useRouter();

  const [updateSurvey, output] = useMutation(UPDATE_SURVEY_ORDER);

  const updateOrder = (order) =>
    updateSurvey({ variables: { id: surveyId, order } });

  return [updateOrder, output];
};

export const useUpdateFolderOrder = () => {
  const [updateFolder, output] = useMutation(UPDATE_FOLDER_ORDER);

  const updateOrder = (folderId, order) =>
    updateFolder({ variables: { folderId, order } });

  return [updateOrder, output];
};

export const useGetSurveyData = () => {
  const {
    query: { surveyId },
  } = useRouter();

  const { data, loading, error } = useQuery(GET_SURVEY_DATA, {
    skip: !Boolean(surveyId),
    variables: { surveyId },
  });

  const searchText = useSurveyStore((state) => state.searchText);

  const order = data?.Survey_by_pk?.order || [];
  const title = data?.Survey_by_pk?.title;
  const questions =
    data?.Survey_by_pk?.Questions?.filter(({ text }) =>
      text?.includes(searchText)
    ) || [];
  const folders = data?.Survey_by_pk?.Folders || [];

  return { order, questions, folders, loading, error, title };
};

export const useGetSurveyRow = () => {
  const { order, questions, folders, ...rest } = useGetSurveyData();

  const itemsById = groupBy([...questions, ...folders], "id");
  const itemsInOrder = order.map((id) => itemsById[id]?.[0]).filter(Boolean);

  return { row: itemsInOrder, ...rest };
};

export const useGetFolderRow = (folderId) => {
  const { questions, folders, loading, error } = useGetSurveyData();

  const currentFolder = folders.find(({ id }) => id === folderId);
  const order = currentFolder?.order || [];

  const itemsById = groupBy([...questions, ...folders], "id");
  const itemsInOrder = order.map((id) => itemsById[id]?.[0]).filter(Boolean);

  return { row: itemsInOrder, loading, error, ...currentFolder, order };
};

export const useUpdateParentOrder = (folderId) => {
  const { order: surveyOrder } = useGetSurveyData();
  const [updateSurveyOrder] = useUpdateSurveyOrder();

  const { order: folderOrder } = useGetFolderRow(folderId);
  const [updateFolderOrder] = useUpdateFolderOrder();

  const addToOrder = (createdId) => {
    if (folderId) {
      updateFolderOrder(folderId, [...folderOrder, createdId]);
    } else {
      updateSurveyOrder([...surveyOrder, createdId]);
    }
  };

  const deleteFromOrder = (deletedId) => {
    const order = folderId ? folderOrder : surveyOrder;

    const orderSet = new Set(order);
    orderSet.delete(deletedId);

    if (folderId) {
      updateFolderOrder(folderId, [...orderSet]);
    } else {
      updateSurveyOrder([...orderSet]);
    }
  };

  return { addToOrder, deleteFromOrder };
};

export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const useDeleteFolder = (folderId, parentFolderId) => {
  const {
    query: { surveyId },
  } = useRouter();

  const { deleteFromOrder } = useUpdateParentOrder(parentFolderId);

  const [deleteFoldersAndQuestions, output] = useMutation(DELETE_FOLDER, {
    onCompleted: () => {
      const deletedId = folderId;
      deleteFromOrder(deletedId);
    },
    refetchQueries: [{ query: GET_SURVEY_DATA, variables: { surveyId } }],
  });
  const deleteFolder = () => {
    deleteFoldersAndQuestions({ variables: { folderId } });
  };

  return [deleteFolder, output];
};

export const useMoveNode = (type, id, currentFolderId, newFolderId) => {
  const [moveBetweenFolders, { loading: loadingOne }] =
    useMutation(MOVE_BETWEEN_FOLDERS);
  const [moveBetweenFoldersSurveys, { loading: loadingTwo }] = useMutation(
    MOVE_BETWEEN_FOLDERS_SURVEYS
  );

  const { order: currentFolderOrder } = useGetFolderRow(currentFolderId);
  const { order: newFolderOrder } = useGetFolderRow(newFolderId);

  const {
    query: { surveyId },
  } = useRouter();
  const { order: surveyOrder } = useGetSurveyData();

  const move = () => {
    if (currentFolderId && newFolderId) {
      const variables = {
        [`${type}Ids`]: [id],
        currentFolderId,
        newFolderId,
        currentFolderOrder: currentFolderOrder.filter((x) => x !== id),
        newFolderOrder: [...newFolderOrder, id],
      };
      moveBetweenFolders({
        variables: { questionIds: [], folderIds: [], ...variables },
      });
    } else if (!currentFolderId && newFolderId) {
      const variables = {
        [`${type}Ids`]: [id],
        newFolderId,
        parentFolderId: newFolderId,
        parentFolderOrder: [...newFolderOrder, id],
        surveyId,
        surveyOrder: surveyOrder.filter((x) => x !== id),
      };

      console.log(variables);

      moveBetweenFoldersSurveys({
        variables: { questionIds: [], folderIds: [], ...variables },
      });
    } else {
      const variables = {
        [`${type}Ids`]: [id],
        newFolderId: null,
        parentFolderId: currentFolderId,
        parentFolderOrder: currentFolderOrder.filter((x) => x !== id),
        surveyId,
        surveyOrder: [...surveyOrder, id],
      };

      console.log(variables);
      moveBetweenFoldersSurveys({
        variables: { questionIds: [], folderIds: [], ...variables },
      });
    }
  };

  return [move, { loading: loadingOne || loadingTwo }];
};
