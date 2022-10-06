import Head from "next/head";

import QuestionView from "components/QuestionView";

import { useToggle } from "hooks";
import CreateQuestion from "../../components/CreateQuestion";

import { useUpdateSurveyOrder, useGetSurveyRow, reorder } from "hooks";

import NextLink from "next/link";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { VStack, Link, HStack, Input } from "@chakra-ui/react";
import FolderView from "../../components/FolderView";
import AddQuestionOrFolder from "../../components/AddQuestionOrFolder";
import CreateFolder from "../../components/CreateFolder";
import useSurveyStore from "../../store";

const SurveyPage = () => {
  const { row, title } = useGetSurveyRow();

  const [showQuestionCreate, toggleQuestionCreateForm] = useToggle();
  const [showFolderCreate, toggleFolderCreateForm] = useToggle();

  const [updateOrder] = useUpdateSurveyOrder();

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(row, result.source.index, result.destination.index);
    updateOrder(items.map(({ id }) => id));
  };

  const searchText = useSurveyStore((state) => state.searchText);
  const setSearchText = useSurveyStore((state) => state.setSearchText);

  return (
    <VStack
      gap="50px"
      padding={["2rem", "3rem"]}
      alignItems="center"
      alignContent="center"
    >
      <Head>
        <title>{title}</title>
      </Head>

      <HStack
        justifyContent="space-between"
        width="100%"
        gap="20px"
        flexWrap="wrap"
      >
        <NextLink href="/" passHref>
          <Link fontSize="2rem" fontWeight="bold">
            Home
          </Link>
        </NextLink>

        <Input
          onChange={setSearchText}
          value={searchText}
          type="text"
          placeholder="Search for questions"
          width="auto"
          flexGrow={1}
        />

        <AddQuestionOrFolder
          onQuestionClick={toggleQuestionCreateForm}
          onFolderClick={toggleFolderCreateForm}
        />
      </HStack>

      {showQuestionCreate && (
        <CreateQuestion cancel={toggleQuestionCreateForm} />
      )}
      {showFolderCreate && <CreateFolder cancel={toggleFolderCreateForm} />}

      <VStack as="main" alignItems={["center", "center", "start"]} width="100%">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={`Survey: ${title}`}>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <VStack gap="1rem">
                  {row.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(providedSecond) =>
                        item.__typename === "Folder" ? (
                          <FolderView {...item} provided={providedSecond} />
                        ) : (
                          <QuestionView {...item} provided={providedSecond} />
                        )
                      }
                    </Draggable>
                  ))}
                </VStack>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </VStack>
    </VStack>
  );
};

export default SurveyPage;
