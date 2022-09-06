import { useMutation } from "@apollo/client";
import React from "react";
import { CREATE_SURVEY } from "../mutations";

import { useFormChange } from "hooks";
import { GET_SURVEYS } from "queries";
import { Button, HStack, Input, VStack } from "@chakra-ui/react";

const CreateSurvey = ({ closeForm }) => {
  const [createSurvey] = useMutation(CREATE_SURVEY, {
    onCompleted: closeForm,
    update: (cache, { data: { createSurvey } }) =>
      cache.updateQuery({ query: GET_SURVEYS }, (data) => ({
        allSurveys: [...data?.allSurveys, createSurvey],
      })),
  });

  const [createFormValues, onCreateFormChange] = useFormChange({
    title: "",
  });

  const createSurveyInForm = (e) => {
    e.preventDefault();
    createSurvey({ variables: createFormValues });
    return false;
  };

  return (
    <VStack
      as="form"
      onSubmit={createSurveyInForm}
      gap="5px"
      borderWidth="2px"
      borderRadius="10px"
      padding="1rem"
      width="300px"
    >
      <Input
        fontSize="1.5rem"
        value={createFormValues.title}
        name="title"
        type="text"
        onChange={onCreateFormChange}
      />

      <HStack justifyContent="space-between" width="100%">
        <Button type="submit" size="sm">
          Create
        </Button>
        <Button onClick={closeForm} type="button" size="sm">
          Cancel
        </Button>
      </HStack>
    </VStack>
  );
};

export default CreateSurvey;
