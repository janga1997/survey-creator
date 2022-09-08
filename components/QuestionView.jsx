import React from "react";

import { GET_QUESTIONS } from "queries";
import { DELETE_QUESTION, UPDATE_QUESTION } from "mutations";

import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

import { useToggle, useFormChange, useUpdateOrder } from "hooks";
import { QuestionForm } from "./CreateQuestion";
import {
  Heading,
  HStack,
  IconButton,
  ListItem,
  Switch,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

const QuestionRead = ({ id, text, toggle, required, answerType, options }) => {
  const {
    query: { surveyId },
  } = useRouter();

  const { data } = useQuery(GET_QUESTIONS, {
    skip: !Boolean(surveyId),
    variables: { surveyId },
  });
  const order = data?.Survey?.order || [];

  const [updateOrder] = useUpdateOrder(surveyId);

  const [deleteQuestion] = useMutation(DELETE_QUESTION, {
    onCompleted: (deletedData) => {
      const deletedId = deletedData?.removeQuestion?.id;
      const orderSet = new Set(order);
      orderSet.delete(deletedId);
      updateOrder([...orderSet]);
    },
    update: (cache, { data: { removeQuestion } }) =>
      cache.updateQuery(
        { query: GET_QUESTIONS, variables: { surveyId } },
        (questionData) => ({
          Survey: {
            ...questionData?.Survey,
            Questions: questionData?.Survey?.Questions.filter(
              ({ id: removedId }) => removedId !== removeQuestion?.id
            ),
          },
        })
      ),
  });

  const deleteFromButton = () => {
    deleteQuestion({ variables: { id } });
  };

  return (
    <VStack
      gap="20px"
      borderWidth="4px"
      borderRadius="10px"
      padding={"1rem"}
      width={["300px", "400px", "600px", "900px"]}
      justifyContent="space-between"
      alignItems="stretch"
    >
      <Heading as="h2" size="lg">
        {text}
      </Heading>
      <HStack justifyContent="space-between">
        <Heading as="span" size="md">{`Type: ${answerType}`}</Heading>
        <label>
          Required:
          <Switch isChecked={Boolean(required)} isReadOnly size="lg" />
        </label>
      </HStack>

      <HStack justifyContent="space-between">
        <IconButton
          aria-label={`Edit question`}
          icon={<EditIcon />}
          onClick={toggle}
        />
        <IconButton
          colorScheme="red"
          aria-label={`Delete question`}
          icon={<DeleteIcon />}
          onClick={deleteFromButton}
        />
      </HStack>
      {answerType.includes("SELECT") && (
        <VStack borderWidth="2px" padding="1rem" alignItems="start">
          <Heading size="md">Options</Heading>
          <UnorderedList label="Options">
            {options.map((value) => (
              <ListItem key={value} fontSize="2xl">
                {value}
              </ListItem>
            ))}
          </UnorderedList>
        </VStack>
      )}
    </VStack>
  );
};

const QuestionEdit = ({
  index,
  id,
  text,
  toggle,
  required,
  answerType,
  options,
}) => {
  const {
    query: { surveyId },
  } = useRouter();

  const [updateQuestion] = useMutation(UPDATE_QUESTION, {
    onCompleted: toggle,
  });

  const [updateFormValues, onUpdateFormChange, setFormValues] = useFormChange({
    id,
    text,
    required,
    answerType,
    options: options || [],
  });

  const updateSurveyInForm = (e) => {
    e.preventDefault();
    updateQuestion({ variables: { ...updateFormValues, surveyId } });
    return false;
  };
  return (
    <QuestionForm
      onSubmit={updateSurveyInForm}
      onChange={onUpdateFormChange}
      onCancel={toggle}
      formValues={updateFormValues}
      setFormValues={setFormValues}
    />
  );
};

const QuestionView = (question) => {
  const [readView, readToggle] = useToggle(true);

  return readView ? (
    <QuestionRead {...question} toggle={readToggle} />
  ) : (
    <QuestionEdit {...question} toggle={readToggle} />
  );
};

export default QuestionView;
