import React from "react";

import { useMutation } from "@apollo/client";
import { DELETE_SURVEY, UPDATE_SURVEY } from "mutations";
import { GET_SURVEYS } from "queries";

import { useToggle, useFormChange, useGetSurveyData } from "hooks";
import NextLink from "next/link";
import {
  Button,
  Heading,
  HStack,
  IconButton,
  Input,
  Link,
  VStack,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { SurveyForm } from "./CreateSurvey";

const SurveyRead = ({ id, title, toggle, order }) => {
  const [deleteSurvey] = useMutation(DELETE_SURVEY, {
    update: (cache, { data: { delete_Survey_by_pk } }) =>
      cache.updateQuery({ query: GET_SURVEYS }, (data) => ({
        Survey: data?.Survey.filter(({ id }) => id !== delete_Survey_by_pk?.id),
      })),
  });

  const deleteFromButton = () => {
    deleteSurvey({ variables: { id } });
  };

  return (
    <VStack
      gap="5px"
      borderWidth="2px"
      borderRadius="10px"
      padding={["0.5rem", "1rem"]}
      width="300px"
    >
      <NextLink href={`/survey/${id}`} passHref>
        <Link fontSize="1.5rem">{title}</Link>
      </NextLink>

      <Heading as="h3" size="sm">{`${
        order?.length || 0
      } questions in this survey`}</Heading>

      <HStack justifyContent="space-between" width="100%">
        <IconButton
          aria-label={`Edit ${title}`}
          icon={<EditIcon />}
          onClick={toggle}
        />
        <IconButton
          colorScheme="red"
          aria-label={`Delete ${title}`}
          icon={<DeleteIcon />}
          onClick={deleteFromButton}
        />
      </HStack>
    </VStack>
  );
};

const SurveyEdit = ({ id, title, toggle }) => {
  const [updateSurvey, { loading }] = useMutation(UPDATE_SURVEY, {
    onCompleted: toggle,
  });

  const [updateFormValues, onUpdateFormChange] = useFormChange({
    id,
    title,
  });

  const updateSurveyInForm = (e) => {
    e.preventDefault();
    updateSurvey({ variables: updateFormValues });
    return false;
  };

  return (
    <SurveyForm
      edit
      loading={loading}
      onSubmit={updateSurveyInForm}
      formValues={updateFormValues}
      onChange={onUpdateFormChange}
      onCancel={toggle}
    />
  );
};

const SurveyView = (survey) => {
  const [readView, readToggle] = useToggle(true);

  return readView ? (
    <SurveyRead {...survey} toggle={readToggle} />
  ) : (
    <SurveyEdit {...survey} toggle={readToggle} />
  );
};

export default SurveyView;
