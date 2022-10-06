import React from "react";

import { GET_SURVEY_DATA } from "queries";
import { DELETE_QUESTION, UPDATE_QUESTION } from "mutations";

import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";

import { useToggle, useFormChange, useUpdateParentOrder } from "hooks";
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
import { DeleteIcon, DragHandleIcon, EditIcon } from "@chakra-ui/icons";
import MoveNode from "./MoveNode";

const QuestionRead = ({
  id,
  text,
  toggle,
  required,
  answerType,
  options,
  folder_id,
  provided,
}) => {
  const {
    query: { surveyId },
  } = useRouter();

  const { deleteFromOrder } = useUpdateParentOrder(folder_id);

  const [deleteQuestion, { loading }] = useMutation(DELETE_QUESTION, {
    onCompleted: (deletedData) => {
      const deletedId = deletedData?.delete_Question_by_pk?.id;
      deleteFromOrder(deletedId);
    },
    update: (cache, { data: { delete_Question_by_pk } }) =>
      cache.updateQuery(
        { query: GET_SURVEY_DATA, variables: { surveyId } },
        (questionData) => ({
          Survey_by_pk: {
            ...questionData?.Survey_by_pk,
            Questions: questionData?.Survey_by_pk?.Questions.filter(
              ({ id: removedId }) => removedId !== delete_Question_by_pk?.id
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
      gap="0.5rem"
      borderWidth="2px"
      borderRadius="10px"
      padding={"1rem"}
      maxWidth="100%"
      width={["300px", "400px", "600px", "1000px"]}
      justifyContent="space-between"
      alignItems="stretch"
      backgroundColor="white"
      ref={provided.innerRef}
      {...provided.draggableProps}
    >
      <HStack justifyContent="space-between">
        <HStack>
          <div {...provided.dragHandleProps}>
            <DragHandleIcon />
          </div>
          <Heading as="h2" size="lg" fontWeight="normal" fontSize="3xl">
            {text}
          </Heading>
        </HStack>
        <MoveNode type="question" id={id} folder_id={folder_id} />
      </HStack>
      <HStack justifyContent="space-between">
        <Heading
          as="span"
          size="xs"
          fontWeight="light"
        >{`Type: ${answerType}`}</Heading>
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
          isLoading={loading}
          aria-label={`Delete question`}
          icon={<DeleteIcon />}
          onClick={deleteFromButton}
        />
      </HStack>
      {answerType.includes("SELECT") && (
        <VStack borderWidth="2px" padding="1rem" alignItems="start">
          <Heading size="md">Options</Heading>
          <UnorderedList label="Options" paddingLeft="2rem">
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

  const [updateQuestion, { loading }] = useMutation(UPDATE_QUESTION, {
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
      edit
      onSubmit={updateSurveyInForm}
      onChange={onUpdateFormChange}
      onCancel={toggle}
      formValues={updateFormValues}
      setFormValues={setFormValues}
      loading={loading}
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
