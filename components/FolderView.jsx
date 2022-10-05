import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Heading,
  HStack,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import QuestionView from "components/QuestionView";

import {
  useGetFolderRow,
  useToggle,
  useUpdateFolderOrder,
  reorder,
  useDeleteFolder,
} from "hooks";
import AddQuestionOrFolder from "./AddQuestionOrFolder";
import CreateQuestion from "./CreateQuestion";
import CreateFolder from "./CreateFolder";
import { DeleteIcon } from "@chakra-ui/icons";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import MoveNode from "./MoveNode";
import useSurveyStore from "../store";

const FolderView = ({ id, name, provided, folder_id }) => {
  const [showQuestionCreate, toggleQuestionCreateForm] = useToggle();
  const [showFolderCreate, toggleFolderCreateForm] = useToggle();
  const { row } = useGetFolderRow(id);

  const [updateOrder] = useUpdateFolderOrder();

  const [deleteFolder, { loading }] = useDeleteFolder(id, folder_id);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const items = reorder(row, result.source.index, result.destination.index);
    updateOrder(
      id,
      items.map(({ id }) => id)
    );
  };

  const [openFolder, toggleFolder, setOpenFolder] = useToggle();
  const expandFolder = () => setOpenFolder(true);

  const searchText = useSurveyStore((state) => state.searchText);

  const expanded = searchText.length ? row.length : openFolder;
  return (
    <Accordion
      index={Number(!expanded)}
      maxWidth="100%"
      width={["300px", "400px", "600px", "1000px"]}
      border="4px"
      borderColor="gray.200"
      borderRadius="10px"
      backgroundColor="cornsilk"
      ref={provided.innerRef}
      {...provided.draggableProps}
    >
      <AccordionItem padding="1rem">
        <HStack justifyContent="space-between">
          <Heading {...provided.dragHandleProps}>{name}</Heading>
          <HStack>
            <AccordionButton width="fit-content" onClick={toggleFolder}>
              <AccordionIcon />
            </AccordionButton>
            <AddQuestionOrFolder
              expandFolder={expandFolder}
              onQuestionClick={toggleQuestionCreateForm}
              onFolderClick={toggleFolderCreateForm}
            />
            <IconButton
              colorScheme="red"
              isLoading={loading}
              aria-label={`Delete folder`}
              icon={<DeleteIcon />}
              onClick={deleteFolder}
            />
            <MoveNode type="folder" folder_id={folder_id} id={id} />
          </HStack>
        </HStack>
        <AccordionPanel>
          <VStack gap="1rem" paddingTop="1rem">
            {showQuestionCreate && (
              <CreateQuestion cancel={toggleQuestionCreateForm} folderId={id} />
            )}
            {showFolderCreate && (
              <CreateFolder cancel={toggleFolderCreateForm} folderId={id} />
            )}
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId={`Folder: ${id}`}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{ width: "100%" }}
                  >
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
                              <QuestionView
                                {...item}
                                provided={providedSecond}
                              />
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
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default FolderView;
