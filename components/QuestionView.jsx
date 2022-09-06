import React from "react";

import { GET_QUESTIONS } from "queries";
import { DELETE_QUESTION, UPDATE_QUESTION } from "mutations";

import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

import { useToggle, useFormChange, useUpdateOrder } from "hooks";
import { OptionsInput } from "./CreateQuestion";
import {
  Button,
  Heading,
  HStack,
  Input,
  ListItem,
  Select,
  Switch,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";

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
    <HStack
      gap="50px"
      borderWidth="4px"
      borderRadius="10px"
      padding="2rem"
      width="100%"
      justifyContent="space-between"
    >
      <VStack justifyItems="start" alignItems="start">
        <Heading as="h2" size="lg">
          {text}
        </Heading>
        {answerType.includes("SELECT") && (
          <VStack borderWidth="2px" padding="1rem">
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
      <VStack>
        <Heading as="span" size="md">{`Answer Type: ${answerType}`}</Heading>
        <label>
          Required:
          <Switch isChecked={Boolean(required)} isReadOnly size="lg" />
        </label>
      </VStack>

      <VStack justifyContent="space-between">
        <Button onClick={toggle}>Edit</Button>
        <Button onClick={deleteFromButton}>Delete</Button>
      </VStack>
    </HStack>
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
    <VStack
      as="form"
      onSubmit={updateSurveyInForm}
      gap="20px"
      alignItems="start"
      borderWidth="2px"
      borderRadius="10px"
      padding="1rem"
    >
      <Input
        value={updateFormValues.text}
        name="text"
        type="text"
        onChange={onUpdateFormChange}
      />

      <HStack justifyContent="space-between" width="100%">
        <label>
          Answer Type:
          <Select
            value={updateFormValues.answerType}
            onChange={onUpdateFormChange}
            name="answerType"
          >
            <option value="TEXT">Text</option>
            <option value="BOOLEAN">Boolean</option>
            <option value="NUMBER">Number</option>
            <option value="SELECT">Single Choice</option>
            <option value="MULTISELECT">Multiple Choice</option>
          </Select>
        </label>
        <label>
          Required:
          <div>
            <Switch
              size="lg"
              isChecked={updateFormValues.required}
              name="required"
              type="checkbox"
              onChange={onUpdateFormChange}
            />
          </div>
        </label>
      </HStack>
      <OptionsInput
        options={updateFormValues.options}
        setFormValues={setFormValues}
        answerType={updateFormValues.answerType}
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

const QuestionView = (question) => {
  const [readView, readToggle] = useToggle(true);

  return readView ? (
    <QuestionRead {...question} toggle={readToggle} />
  ) : (
    <QuestionEdit {...question} toggle={readToggle} />
  );
};

export default QuestionView;
