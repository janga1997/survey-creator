import express from "express";
import jsonGraphqlExpress from "json-graphql-server";

const app = express();
const data = {
  surveys: [
    { id: 1, title: "Lorem Ipsum" },
    { id: 2, title: "Sic Dolor amet" },
  ],
  questions: [
    {
      id: 1,
      text: "What's your name",
      survey_id: 1,
      required: true,
      answerType: "BOOLEAN",
      options: ["Janga"],
    },
  ],
};

app.use("/api/graphql", jsonGraphqlExpress(data));

export default app;
