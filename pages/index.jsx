import { useQuery } from "@apollo/client";
import Head from "next/head";
import styles from "../styles/Home.module.css";

import SurveyView from "../components/SurveyView";

import { GET_SURVEYS } from "../queries";
import { useToggle } from "hooks";
import CreateSurvey from "../components/CreateSurvey";
import { Button, Divider, Heading, HStack, VStack } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

const Home = () => {
  const { data } = useQuery(GET_SURVEYS, { fetchPolicy: "cache-and-network" });
  const surveys = data?.Survey || [];

  const [showCreate, toggleCreateForm] = useToggle();

  return (
    <VStack
      gap="50px"
      padding={["2rem", "3rem"]}
      alignItems="center"
      alignContent="center"
    >
      <HStack
        justifyContent="space-between"
        width="100%"
        gap="20px"
        flexWrap="wrap"
      >
        <Heading>List of Surveys</Heading>
        <Button onClick={toggleCreateForm} rightIcon={<AddIcon />}>
          Create Form
        </Button>
      </HStack>

      <HStack
        justifyItems="start"
        width="100%"
        gap="30px"
        flexWrap="wrap"
        alignItems="start"
      >
        {showCreate && <CreateSurvey closeForm={toggleCreateForm} />}
        {surveys.map((survey, index) => (
          <SurveyView {...survey} index={index} key={survey.id} />
        ))}
      </HStack>
    </VStack>
  );
};

export default Home;
