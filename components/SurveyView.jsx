import React from "react";

import { useMutation } from "@apollo/client";
import { DELETE_SURVEY, UPDATE_SURVEY } from "mutations";
import { GET_SURVEYS } from "queries";

import { useToggle, useFormChange } from "hooks";
import NextLink from "next/link";
import { Button, Heading, HStack, Input, Link, VStack } from "@chakra-ui/react";

const SurveyRead = ({ id, title, toggle, order }) => {
  const [deleteSurvey] = useMutation(DELETE_SURVEY, {
    update: (cache, { data: { removeSurvey } }) =>
      cache.updateQuery({ query: GET_SURVEYS }, (data) => ({
        allSurveys: data?.allSurveys.filter(
          ({ id }) => id !== removeSurvey?.id
        ),
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
      padding="1rem"
      width="300px"
    >
      <NextLink href={`/survey/${id}`} passHref>
        <Link fontSize="1.5rem">{title}</Link>
      </NextLink>

      <Heading as="h3" size="sm">{`${
        order?.length || 0
      } questions in this survey`}</Heading>

      <HStack justifyContent="space-between" width="100%">
        <Button onClick={toggle} size="sm">
          Edit
        </Button>
        <Button onClick={deleteFromButton} size="sm">
          Delete
        </Button>
      </HStack>
    </VStack>
  );
};

const SurveyEdit = ({ id, title, toggle }) => {
  const [updateSurvey] = useMutation(UPDATE_SURVEY, {
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
    <VStack
      as="form"
      onSubmit={updateSurveyInForm}
      gap="5px"
      borderWidth="2px"
      borderRadius="10px"
      padding="1rem"
      width="300px"
    >
      <Input
        value={updateFormValues.title}
        name="title"
        type="text"
        onChange={onUpdateFormChange}
      />

      <HStack justifyContent="space-between" width="100%">
        <Button type="submit" size="sm">
          Update
        </Button>
        <Button onClick={toggle} type="button" size="sm">
          Cancel
        </Button>
      </HStack>
    </VStack>
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
