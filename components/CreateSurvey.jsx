import { useMutation } from "@apollo/client";
import React from "react";
import { CREATE_SURVEY } from "../mutations";

import { useFormChange } from "hooks";
import { GET_SURVEYS } from "queries";
import { Button, HStack, Input, VStack } from "@chakra-ui/react";

export const SurveyForm = ({
  formValues,
  onChange,
  onSubmit,
  onCancel,
  loading,
  edit,
}) => {
  return (
    <VStack
      as="form"
      onSubmit={onSubmit}
      gap="5px"
      borderWidth="2px"
      borderRadius="10px"
      padding="1rem"
      width="300px"
    >
      <Input
        fontSize="1.5rem"
        value={formValues.title}
        name="title"
        type="text"
        onChange={onChange}
      />

      <HStack justifyContent="space-between" width="100%">
        <Button
          type="submit"
          size="sm"
          isLoading={loading}
          loadingText={edit ? "Updating" : "Creating"}
        >
          {edit ? "Update" : "Create"}
        </Button>
        <Button onClick={onCancel} type="button" size="sm">
          Cancel
        </Button>
      </HStack>
    </VStack>
  );
};

const CreateSurvey = ({ closeForm }) => {
  const [createSurvey, { loading }] = useMutation(CREATE_SURVEY, {
    onCompleted: closeForm,
    update: (cache, { data: { insert_Survey_one } }) =>
      cache.updateQuery({ query: GET_SURVEYS }, (data) => ({
        Survey: [...data?.Survey, insert_Survey_one],
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
    <SurveyForm
      loading={loading}
      onSubmit={createSurveyInForm}
      onCancel={closeForm}
      formValues={createFormValues}
      onChange={onCreateFormChange}
    />
  );
};

export default CreateSurvey;
